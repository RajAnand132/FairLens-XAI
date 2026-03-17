# College Submission Checklist – FairLens XAI Loan Platform

Use this checklist before submitting your project.

---

## Documents to Submit

- [ ] `Docs/PROJECT_REPORT.md` — Main project report (~5,800 words)
- [ ] `Docs/ABSTRACT.md` — Standalone abstract (248 words)
- [ ] `Docs/PRESENTATION_OUTLINE.md` — Viva/seminar slides outline
- [ ] `Docs/architecture_flow.md` — System architecture diagram
- [ ] `Docs/requirements.md` — Functional & technical requirements

---

## Fill in Personal Details (PROJECT_REPORT.md)

Open `Docs/PROJECT_REPORT.md` and replace all placeholders:

- [ ] `[Your Course Name / Subject Code]` — e.g., *CS401 – Artificial Intelligence*
- [ ] `[Your Name(s)]` — Your full name(s)
- [ ] `[Your Roll No.]` — Your university roll number
- [ ] `[Your Department]` — e.g., *Department of Computer Science & Engineering*
- [ ] `[Your College Name]` — e.g., *ABC Institute of Technology*
- [ ] `[Supervisor Name]` — e.g., *Prof. Dr. XYZ*

---

## Fill in Personal Details (ABSTRACT.md)

- [ ] `[Your Name(s)]`
- [ ] `[Your College]` and `[Your Department]`
- [ ] `[Course Name / Code]`

---

## Code / Project Verification

- [ ] Run `npm install` — all dependencies install without errors
- [ ] Run `npm run dev` — app loads at `http://localhost:5173`
- [ ] Applicant dashboard works end-to-end (form → results → simulator)
- [ ] Document upload flow completes (even with mock extraction)
- [ ] Officer dashboard loads with all 3 cases
- [ ] Dark/light theme toggle works
- [ ] Gemini API key is valid (test at `aistudio.google.com`)
- [ ] `.env` file has correct `VITE_GEMINI_API_KEY`

---

## Demo Preparation

- [ ] Prepare 2–3 test inputs (use Appendix C data from PROJECT_REPORT.md)
- [ ] Test the ImprovementSimulator sliders live during demo
- [ ] Prepare answers to Q&A questions (see PRESENTATION_OUTLINE.md Slide 17)
- [ ] Know how to navigate between `/applicant` and `/officer` routes

---

## Optional Enhancements (if time permits)

- [ ] Add your name to the Navbar user chip (currently "Sarah Chen")
- [ ] Replace mock document extraction with real Gemini multimodal call
- [ ] Add multi-lingual toggle (English / Hindi)
- [ ] Export Action Plan as PDF using browser print API

---

## Submission Formats

Most colleges accept one of:
- **Printed report** (A4, 12pt font, 1.5 line spacing) — convert .md to .docx or .pdf
- **GitHub repository link** — ensure README.md is complete
- **ZIP file** — include all source + Docs folder

**To convert to PDF:** Open PROJECT_REPORT.md in VS Code → Install "Markdown PDF" extension → Right-click → "Markdown PDF: Export (pdf)"

---

*Good luck with your submission!*
