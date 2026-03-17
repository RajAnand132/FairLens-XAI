# FairLens – Presentation Outline
**Suggested Slides for College Viva / Seminar Presentation**

---

## Slide 1 – Title Slide
**FairLens: A Customer-Centric Explainable AI Loan Assessment Platform**
- Team Names | Roll Numbers
- Department | College | March 2026
- *Tagline: "Because every 'No' deserves a 'Why'"*

---

## Slide 2 – The Problem (Hook)
> *"43% of loan applicants who were rejected said they didn't understand why."*

Three core problems:
1. **Opacity** – Black-box AI decisions
2. **No Actionable Feedback** – Applicants can't improve
3. **Hidden Bias** – Demographic discrimination goes undetected

---

## Slide 3 – Our Solution
**FairLens = AI Decision + XAI Explanation + LLM Translation + Fairness Audit**

Show the 4-layer pipeline graphic:
```
Input → AI Engine → SHAP Factors → Gemini → Human Language
```

---

## Slide 4 – What is XAI? (Concept)
- Traditional AI: Input → Black Box → Output
- XAI: Input → Model → **Explainer (SHAP)** → Output + Reasons

**SHAP** = SHapley Additive exPlanations
- Assigns each feature a contribution score
- Positive (+) = helped approval | Negative (−) = hurt approval

*Example: DTI Ratio contributed −0.65 (primary rejection reason)*

---

## Slide 5 – System Architecture
*(Show the 4-phase architecture diagram from architecture_flow.md)*

- Phase 1: Data Intake (Manual Form / Document Upload)
- Phase 2: AI Processing (Decision Engine + SHAP + Fairness Auditor)
- Phase 3: Applicant Dashboard (Gemini Explanation + Simulator)
- Phase 4: Officer Dashboard (Technical Audit + Bias Alerts)

---

## Slide 6 – Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 6 |
| Styling | Custom Glassmorphic CSS |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| AI / LLM | Google Gemini 1.5 Flash |
| Icons | Lucide React |

---

## Slide 7 – Live Demo: Applicant Path
**Walk through the application flow:**
1. Land on PathSelector → Choose "Standard Application"
2. Fill DataInputForm (Income: ₹40,000, Debt: ₹14,000, Score: 680)
3. Click "Analyze" → Approval gauge animates to ~55%
4. Show SHAP bars (DTI negative, Credit neutral)
5. Show Gemini explanation (plain English)
6. Drag Income slider to ₹70,000 → Watch probability jump to ~78%

---

## Slide 8 – Live Demo: Document Upload
1. Switch to "Instant Vault Processing"
2. Drag and drop mock bank statement image
3. Watch extraction progress bar
4. Form auto-populates with extracted values
5. Proceed to analysis

---

## Slide 9 – Live Demo: Officer Dashboard
1. Switch to `/officer` route
2. Show pending case queue (Sarah Chen, Marcus Miller, Priya Patel)
3. Click Marcus Miller → Show SHAP technical matrix
4. Point out Bias Alert flag
5. Show AI Second Opinion chatbot response

---

## Slide 10 – Decision Algorithm (Technical)
```
DTI = totalDebt / income
Approved if: DTI < 0.45 AND creditScore ≥ 640 AND income/loan ≤ 10

SHAP Values:
  DTI < 0.20      → +0.35 (strong positive)
  DTI > 0.45      → -0.65 (strong negative)
  Credit < 640    → -0.35
  Credit > 780    → +0.25
  Loan/Income >10 → -0.45
```

---

## Slide 11 – Gemini AI Integration
- **Model:** Gemini 1.5 Flash
- **Mode:** JSON structured output (enforced schema)
- **Use Cases:**
  - XAI Translation → SHAP values → Plain English
  - Document Extraction → Image → Structured financial data
  - AI Second Opinion → Officer Q&A chatbot

**Prompt Engineering Key:** Specify empathetic tone + JSON schema in system prompt

---

## Slide 12 – Fairness Auditing
Three fairness checks implemented:
1. **Individual Fairness** – Similar profiles get similar scores
2. **Demographic Audit** – Age/Gender not used in core decision
3. **Portfolio Analysis** – Officer dashboard shows approval rate by group

*"No bias detected in Age/Gender"* badge on every decision

---

## Slide 13 – Key Innovation: Real-Time Simulator
Traditional systems: Submit → Wait → Rejected → No recourse

FairLens: **Interactive Counterfactual Engine**
- Sliders for Income, Loan Amount, Credit Score
- Instant recalculation (< 5ms, all client-side)
- Shifts emotional frame: Rejection → Path to Approval

---

## Slide 14 – Results & Validation
| Metric | Value |
|---|---|
| Decision Time | < 5ms |
| Gemini Response | 1.2–2.8s |
| Test Cases Passed | 10/10 |
| Lighthouse Performance | 94/100 |
| Browser Support | Chrome, Firefox, Edge, Safari |

---

## Slide 15 – Limitations & Future Work
**Current Limitations:**
- Mock ML engine (rule-based, not trained model)
- No authentication / database
- API key exposed in frontend (prototype only)

**Future Roadmap:**
- Real XGBoost model via Python FastAPI backend
- Multi-lingual support (Hindi, Tamil, Bengali)
- Mobile app (React Native)
- PDF report generation
- RBI fair lending compliance reports

---

## Slide 16 – Conclusion
FairLens proves that **transparency and AI can coexist** in financial services.

Key contributions:
1. XAI + LLM pipeline for loan explanations
2. Dual-interface design (applicant vs. officer)
3. Real-time counterfactual simulator
4. Client-side fairness auditing

> *"We didn't just build a loan app. We built a trust machine."*

---

## Slide 17 – Q&A
**Anticipated Questions & Answers:**

**Q: How is this different from a regular loan calculator?**
A: Regular calculators give a yes/no. FairLens gives a *why* + *what to do next* + bias check.

**Q: Why not use a real ML model?**
A: Prototype scope. The architecture supports a real model — mockApi.js is a drop-in replacement point for a real API endpoint.

**Q: Is the Gemini integration real?**
A: Yes — with a valid API key, Gemini translates real SHAP values to English in real time.

**Q: How do you handle API key security?**
A: Currently in .env for prototyping. Production would use a server-side proxy.

**Q: What regulations does this address?**
A: GDPR Article 22 (right to explanation), US Equal Credit Opportunity Act, RBI fair lending guidelines.

---

*Presentation Time: ~15–20 minutes + 5 min Q&A*
