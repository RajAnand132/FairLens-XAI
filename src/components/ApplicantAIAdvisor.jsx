import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, ChevronRight, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Quick-question chips ────────────────────────────────────────────────────
const ROLE_CHIPS = {
  applicant: [
    'How can I improve my approval chance?',
    'What loan amount can I realistically get?',
    'How do I fix my debt-to-income ratio?',
    'How long to improve my credit score?',
    'What if I increase my income?',
    'Explain my result in simple terms',
    'Does my age/gender impact this?',
    'Can I add a co-applicant to help?',
    'Show me the biggest negative factor.',
    'What if I decrease my loan amount?',
  ],
  admin: [
    'Audit this decision for bias factors.',
    'Evaluate sensitivity to protected classes.',
    'Compare with historical bank approval rates.',
    'Are there any regulatory compliance flags?',
    'Show decision logs and model path.',
    'Explain this result for a technical audit.',
  ]
};

// ─── Build the system context prompt ────────────────────────────────────────
const buildContext = (profileData, result) => {
  const fmt     = (v) => (v != null ? v : 'N/A');
  const income  = parseFloat(profileData?.income)      || 0;
  const debt    = parseFloat(profileData?.totalDebt)   || 0;
  const loan    = parseFloat(profileData?.loanAmount)  || 0;
  const credit  = parseFloat(profileData?.creditScore) || 0;
  const dti     = income > 0 ? ((debt / income) * 100).toFixed(1) : 'N/A';

  return `
You are "Aira," a warm, empathetic AI financial advisor helping a loan applicant understand their application result and improve their financial profile. You are on the applicant's side — not the bank's.

CRITICAL IDENTITY RULES:
- Never mention internal model names (e.g., Gemini, Google, GPT).
- Refer to yourself only as "Aira" or "your personal advisor."
- If asked about your nature, explain that you are the built-in intelligent assistance for the FairLens platform.

APPLICANT PROFILE:
- Monthly Income:     ₹${fmt(income.toLocaleString('en-IN'))}
- Total Monthly Debt: ₹${fmt(debt.toLocaleString('en-IN'))}
- Loan Requested:     ₹${fmt(loan.toLocaleString('en-IN'))}
- Credit Score:       ${fmt(credit)}
- Employment:         ${fmt(profileData?.employmentStatus)}
- DTI Ratio:          ${dti}%

AUDIT RESULT:
- Decision:              ${result?.approved ? 'PRE-APPROVED ✓' : 'ACTION REQUIRED ✗'}
- Approval Probability:  ${result?.probability ?? 0}%
- Model Confidence:      ${result?.confidence ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'}

SHAP FACTORS (what is driving the decision):
${result?.factors?.map(f => `  • ${f.name}: ${f.value > 0 ? '+' : ''}${(f.value * 100).toFixed(0)}% — ${f.description}`).join('\n') || '  No significant factors flagged.'}

CURRENT ACTION PLAN:
${result?.actionPlan?.map((s, i) => `  ${i + 1}. ${typeof s === 'string' ? s : s.text}`).join('\n') || '  None.'}

INSTRUCTIONS FOR YOU:
- Respond in plain, friendly English — no financial jargon unless the user asks.
- Be specific with numbers (e.g. "increase income by ₹15,000/month" not just "increase income").
- Keep responses concise: 3–5 sentences. Use a numbered list only if breaking down multiple steps.
- Always be encouraging and solution-focused.
- If asked about a specific scenario (e.g. "what if I earn ₹1L/month"), calculate the DTI or ratio and give a concrete answer.
- Never tell the user to "consult a financial advisor" — you ARE their advisor in this context.
`.trim();
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const buildWelcome = (profileData, result) => {
  if (!result) return "Hi! I'm your AI financial advisor. Share your profile and I'll help you understand your loan situation.";
  const prob     = result.probability ?? 0;
  if (result.approved) {
    return `Great news — your application looks strong with a **${prob}% approval probability**! I'm here to answer any questions and help you put your best foot forward for the final submission.`;
  }
  const topBlock = result.factors?.find(f => f.value < 0);
  const hint     = topBlock ? ` Your biggest hurdle right now is **${topBlock.name.toLowerCase()}**.` : '';
  return `I've reviewed your application — your current approval probability is **${prob}%**.${hint} Let me help you understand exactly what's happening and how to improve your chances. Ask me anything below, or pick a quick question to get started.`;
};

// ─── Markdown bold renderer ───────────────────────────────────────────────────
const renderText = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
};

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className="animate-in" style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      gap: '0.75rem',
      marginBottom: '1rem',
      width: '100%'
    }}>
      {/* Bot Icon outside */}
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'rgba(16,185,129,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(16,185,129,0.2)',
          marginTop: '4px', flexShrink: 0
        }}>
          <Bot size={14} color="#10b981" />
        </div>
      )}

      <div style={{
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: isUser ? '16px 16px 2px 16px' : '2px 16px 16px 16px',
        fontSize: '0.86rem',
        lineHeight: 1.6,
        background: isUser
          ? 'rgba(99, 102, 241, 0.12)'
          : 'var(--bg-elevated)',
        color: 'var(--text-main)',
        border: `1px solid ${isUser ? 'rgba(99,102,241,0.25)' : 'var(--border-glass)'}`,
        boxShadow: isUser ? '0 4px 16px rgba(0,0,0,0.1), 0 0 10px rgba(99,102,241,0.03)' : 'none',
        position: 'relative',
        backdropFilter: isUser ? 'blur(8px)' : 'none',
        fontWeight: isUser ? 600 : 400
      }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {renderText(msg.text)}
        </div>
      </div>

      {/* User Icon outside */}
      {isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border-glass)',
          marginTop: '4px', flexShrink: 0
        }}>
          <User size={14} color="var(--text-dim)" />
        </div>
      )}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────
const ApplicantAIAdvisor = ({ profileData, result, session }) => {
  const [messages,  setMessages]  = useState([]);
  const [inputVal,  setInputVal]  = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chipsUsed, setChipsUsed] = useState([]);

  const chatRef   = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Re-init when result changes
  useEffect(() => {
    setMessages([{ role: 'assistant', text: buildWelcome(profileData, result), isWelcome: true }]);
    setChipsUsed([]);
    chatRef.current = null;
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll: Only if it's a new message from USER or if AI is starting to think
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if ((lastMsg?.role === 'user' || isLoading) && !lastMsg?.isWelcome) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const getOrCreateChat = useCallback(() => {
    if (chatRef.current) return chatRef.current;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;

    const genAI  = new GoogleGenerativeAI(apiKey);
    const model  = genAI.getGenerativeModel({
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    });

    chatRef.current = model.startChat({
      history: [
        { role: 'user',  parts: [{ text: buildContext(profileData, result) }] },
        { role: 'model', parts: [{ text: "Understood. I have the applicant profile loaded. I'm ready to give personalised, empathetic advice." }] },
      ],
    });
    return chatRef.current;
  }, [profileData, result]);

  const sendMessage = useCallback(async (text) => {
    const msg = text.trim();
    if (!msg || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInputVal('');
    setIsLoading(true);

    try {
      const chat = getOrCreateChat();
      if (!chat) throw new Error('Advisor initialization required.');
      const res  = await chat.sendMessage(msg);
      setMessages(prev => [...prev, { role: 'assistant', text: res.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `I'm having a little trouble connecting to my system right now. Please wait a moment and try asking me again!`,
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isLoading, getOrCreateChat]);

  const handleChip = (chip) => {
    if (isLoading) return;
    setChipsUsed(prev => [...prev, chip]);
    sendMessage(chip);
  };

  const handleReset = () => {
    chatRef.current = null;
    setMessages([{ role: 'assistant', text: buildWelcome(profileData, result), isWelcome: true }]);
    setChipsUsed([]);
    setInputVal('');
  };

  const roleKey = session?.role === 'admin' ? 'admin' : 'applicant';
  const chips   = ROLE_CHIPS[roleKey] || ROLE_CHIPS.applicant;

  const availableChips = chips.filter(c => !chipsUsed.includes(c));
  const showChips      = availableChips.length > 0 && messages.length <= 1;

  return (
    <div className="card-luxe" style={{ marginTop: '1.5rem' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} color="#10b981" />
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Aira Advisor
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>• Financial Intelligence</span>
        </div>
        <button onClick={handleReset} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.2rem' }} title="Reset Conversation">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Context strip ─────────────────────────────────────────────────── */}
      {/* ── Compact Context ─────────────────────────────────────────────── */}
      {result && (
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          fontSize: '0.65rem', color: 'var(--text-dim)',
          marginBottom: '1rem', background: 'rgba(255,255,255,0.02)',
          padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-glass)'
        }}>
          <span>Prob: <strong style={{ color: result.probability >= 50 ? '#10b981' : '#f43f5e' }}>{result.probability}%</strong></span>
          {profileData?.income && <span>Inc: <strong style={{ color: 'var(--text-muted)' }}>{fmtINR(parseFloat(profileData.income))}/mo</strong></span>}
          <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{result.approved ? 'Pre-Approved' : 'Action Required'}</span>
        </div>
      )}

      {/* ── Quick chips ───────────────────────────────────────────────────── */}
      {showChips && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{
            fontSize: '0.65rem', color: 'var(--text-dim)',
            textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.8px',
            marginBottom: '0.6rem',
          }}>
            Quick questions
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {availableChips.slice(0, 6).map(chip => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                disabled={isLoading}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '20px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  opacity: isLoading ? 0.45 : 1,
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)';
                    e.currentTarget.style.color = '#10b981';
                    e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
              >
                <ChevronRight size={11} />
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat window ───────────────────────────────────────────────────── */}
      {/* ── Chat Flow ───────────────────────────────────────────────────── */}
      <div className="scroll-glass" style={{
        height: '340px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '0.75rem',
        paddingRight: '0.5rem'
      }}>
        {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

        {/* Typing indicator */}
        {/* Typing indicator */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-glass)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px' }}>
              {[0, 0.2, 0.4].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1s infinite', animationDelay: `${d}s` }} />)}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(inputVal); }}
        style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}
      >
        <input
          ref={inputRef}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
          placeholder="Ask Aira..."
          disabled={isLoading}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isLoading || !inputVal.trim() ? 'transparent' : '#10b981',
            borderRadius: '8px', color: '#fff', cursor: 'pointer', border: 'none', transition: 'all 0.2s'
          }}
        >
          {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>

    </div>
  );
};

export default ApplicantAIAdvisor;
