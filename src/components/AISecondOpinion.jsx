import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Cpu, RotateCcw, ChevronRight, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Quick-question chips ────────────────────────────────────────────────────
const ROLE_CHIPS = {
  officer: [
    'Run sensitivity analysis on Income.',
    'Identify potential high-risk indicators.',
    'What are the top 3 risk factors here?',
    'Suggest a safe counter-offer amount.',
    'Summarize case for credit committee.',
    'Check correlation with local benchmarks.',
  ],
  admin: [
    'Run full technical bias audit.',
    'Export XAI feature metadata (JSON).',
    'Evaluate sensitivity to protected classes.',
    'Check for manual override flags.',
    'Verify income-to-debt ratio against logs.',
    'Perform system-wide contrastive analysis.',
  ]
};

// ─── Build officer context for multi-turn session ─────────────────────────────
const buildOfficerContext = (applicationData, xaiFactors) => `
You are the "AI Technical Oracle," a sophisticated technical analysis agent assisting a human Bank Loan Officer.
Use precise banking and ML terminology. Be analytical, concise, and evidence-based.

CRITICAL IDENTITY RULES:
- Never mention internal model names, technical architectures, or specific AI providers (e.g., no mention of Gemini, Google, or Large Language Models).
- Refer to yourself only as the "Technical Oracle."
- If asked about your nature, respond that you are a proprietary analysis engine integrated into the FairLens platform.

APPLICANT DATA:
${JSON.stringify(applicationData || {}, null, 2)}

SHAP FEATURE CONTRIBUTIONS:
${JSON.stringify(xaiFactors || [], null, 2)}

INSTRUCTIONS:
- Respond with technical precision. Use ML/finance terminology.
- Reference specific numbers from the applicant data and SHAP values.
- Keep responses to 3–6 sentences unless a detailed breakdown is requested.
- Do not use customer-facing empathetic language — this is an officer review tool.
- If asked about counterfactuals, compute them using the provided data.
`.trim();

// ─── Markdown bold renderer ───────────────────────────────────────────────────
const renderText = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
};

// ─── Bubble ───────────────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className="animate-in" style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      gap: '0.75rem',
      marginBottom: '0.75rem',
      width: '100%'
    }}>
      {!isUser && (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-active)', marginTop: '2px', flexShrink: 0 }}>
          <Cpu size={14} color="var(--primary)" />
        </div>
      )}
      
      <div style={{
        maxWidth: '80%',
        padding: '0.65rem 0.85rem',
        borderRadius: isUser ? '14px 14px 2px 14px' : '2px 14px 14px 14px',
        fontSize: '0.84rem',
        lineHeight: 1.5,
        background: isUser ? 'var(--primary)' : 'var(--bg-elevated)',
        color: isUser ? '#000' : 'var(--text-main)',
        border: `1px solid ${isUser ? 'var(--primary)' : 'var(--border-glass)'}`,
        boxShadow: isUser ? '0 4px 12px var(--primary-glow)' : 'none',
        position: 'relative',
        fontWeight: isUser ? 700 : 400
      }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {renderText(msg.text)}
        </div>
      </div>

      {isUser && (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)', marginTop: '2px', flexShrink: 0 }}>
          <User size={14} color="var(--text-muted)" />
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const AISecondOpinion = ({ applicationData, xaiFactors, session }) => {
  const WELCOME = "Hello. I'm the AI Technical Oracle. I have access to the full applicant profile and SHAP feature weights. Query model behavior, feature interactions, or counterfactual scenarios.";

  const [messages,  setMessages]  = useState([{ role: 'assistant', text: WELCOME, isWelcome: true }]);
  const [inputVal,  setInputVal]  = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chipsUsed, setChipsUsed] = useState([]);

  const chatRef   = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Re-seed session when case changes
  useEffect(() => {
    setMessages([{ role: 'assistant', text: WELCOME, isWelcome: true }]);
    setChipsUsed([]);
    chatRef.current = null;
  }, [applicationData]);  // eslint-disable-line react-hooks/exhaustive-deps

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
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
        { role: 'user',  parts: [{ text: buildOfficerContext(applicationData, xaiFactors) }] },
        { role: 'model', parts: [{ text: 'Context loaded. Applicant profile and SHAP vectors acknowledged. Ready for technical queries.' }] },
      ],
    });
    return chatRef.current;
  }, [applicationData, xaiFactors]);

  const sendMessage = useCallback(async (text) => {
    const msg = text.trim();
    if (!msg || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInputVal('');
    setIsLoading(true);

    try {
      const chat = getOrCreateChat();
      if (!chat) throw new Error('System initialization required.');
      const res = await chat.sendMessage(msg);
      setMessages(prev => [...prev, { role: 'assistant', text: res.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `The Technical Oracle is currently optimizing its analysis engines. Please try your query again in a few moments.`,
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
    setMessages([{ role: 'assistant', text: WELCOME, isWelcome: true }]);
    setChipsUsed([]);
    setInputVal('');
  };

  const roleKey = session?.role === 'admin' ? 'admin' : 'officer';
  const chips   = ROLE_CHIPS[roleKey] || ROLE_CHIPS.officer;
  const availableChips = chips.filter(c => !chipsUsed.includes(c));
  const showChips      = applicationData && availableChips.length > 0 && messages.length <= 1;

  return (
    <div className="card-luxe">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Cpu size={18} color="#6366f1" />
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Technical Oracle
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>• Neural Query Engine</span>
        </div>
        <button onClick={handleReset} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.2rem' }} title="Reset Session">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* ── Compact Context ─────────────────────────────────────────────── */}
      {applicationData ? (
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          fontSize: '0.65rem', color: 'var(--text-dim)',
          marginBottom: '1rem', background: 'rgba(255,255,255,0.02)',
          padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-glass)'
        }}>
          <span>Case: <strong style={{ color: '#6366f1' }}>{applicationData.id}</strong></span>
          <span>Profile: <strong style={{ color: 'var(--text-muted)' }}>{applicationData.name}</strong></span>
          <span>Score: <strong style={{ color: 'var(--text-muted)' }}>{applicationData.creditScore}</strong></span>
        </div>
      ) : (
        <div style={{
          fontSize: '0.65rem', color: 'var(--text-dim)',
          marginBottom: '1rem', background: 'rgba(255,255,255,0.01)',
          padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px dashed var(--border-glass)'
        }}>
          System Status: <strong style={{ color: 'var(--text-dim)' }}>Ready — Awaiting Authorized Case Context</strong>
        </div>
      )}
      {/* ── Quick Questions ─────────────────────────────────────────────────── */}
      {showChips && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
            Technical Queries
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {availableChips.map(chip => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '18px',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              >
                <ChevronRight size={11} color="#6366f1" />
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat window ────────────────────────────────────────────────────── */}
      {/* ── Chat Flow ────────────────────────────────────────────────────── */}
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
              {[0, 0.2, 0.4].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366f1', animation: 'pulse-dot 1s infinite', animationDelay: `${d}s` }} />)}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(inputval); }}
        style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}
      >
        <input
          ref={inputRef}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
          placeholder="Ask the Technical Oracle..."
          disabled={isLoading}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isLoading || !inputVal.trim() ? 'transparent' : '#6366f1',
            border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
};

export default AISecondOpinion;
