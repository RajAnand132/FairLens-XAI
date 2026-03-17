# XAI Loan Platform - Requirements Document

This is a living document that captures the functional, technical, and UI/UX requirements for the Customer-Centric Explainable AI (XAI) Loan Platform. It will be updated continuously as the project progresses.

---

## 1. Project Objective
To build a transparent, AI-driven lending platform that moves beyond "silent rejections." It must predict loan approval based on user data, explain *why* decisions are made in plain language, and provide actionable next steps using AI to help the applicant secure financing.

---

## 2. Functional Requirements

### 2.1 Applicant Dashboard
- **Data Input:** Users must be able to input data either manually via a form or automatically by uploading documents (PDFs/Images).
- **Status Display:** Clear binary outcome ("Approved" or "Rejected") alongside a probability gauge.
- **The "Why" Visualizer:** Explanations for the decision, translated from technical ML weights (SHAP values) into plain English using the Gemini API.
- **Action Plan:** A tailored, actionable list of steps needed to flip a rejection into an approval (e.g., "Pay off 20% of your current debt").
- **Improvement Simulator:** Interactive sliders allowing users to play with independent variables (Income, Loan Amount) and immediately see the impact on their approval probability.
- **Advanced Features:**
  - Multi-lingual selection for dynamic translation of explanations.
  - "What-If" Life Event selections (e.g., "Got a raise", "Paid off car loan").
  - "Next Best Offer" presentation for rejected loans.

### 2.2 Bank Officer Dashboard
- **Technical Metrics:** Access to raw confidence scores, specific feature importance weights (SHAP values), and model confidence.
- **Auditing & Compliance:** Automatic detection and alert flagging if demographic attributes (Age, Gender, Ethnicity) cross an unacceptable influence threshold.
- **AI Second Opinion:** A chat interface linked to the specific application, allowing the officer to ask the Gemini API questions about the model's reasoning.
- **Portfolio Analytics:** A dashboard summarizing macro-level bias and fairness across recent applications.

---

## 3. Technical Requirements

### 3.1 Frontend Architecture
- **Framework:** React.js initialized with Vite.
- **Styling:** Vanilla CSS implemented as a custom dynamic design system.
- **Aesthetics:** Vibrant, premium look utilizing glassmorphism, smooth animations, and modern typography (e.g., Inter/Outfit).
- **Responsiveness:** Highly mobile-responsive across all applicant views.

### 3.2 Backend & ML Architecture (Prototype Phase)
*Note: True ML inference and backend routing are simulated inside the frontend for this prototype.*
- **Prediction Simulation:** Mock algorithms representing an ensemble model (Random Forest / XGBoost).
- **Explainability Simulation:** Mock responses representing SHAP/LIME feature importance calculation.
- **Gemini Contextualization:** 
  - Implementation of the `gemini-pro-vision` API for document OCR.
  - Implementation of the `gemini-pro` API for language translation and chatbot interactions.

---

## 4. System Prerequisites & Setup
To run this application locally, the following environment setup is required:

### 4.1 Prerequisites
- **Node.js**: The LTS (Long Term Support) version of Node.js must be installed to execute JavaScript code outside a browser and manage packages.
- **npm (Node Package Manager)**: Comes bundled with Node.js and is required to install project dependencies.
- **Gemini API Key**: A valid API key from Google AI Studio must be obtained and placed in a local `.env` file to power the LLM features.

### 4.2 Setup & Run Instructions
1. Install Node.js from the official website.
2. Initialize the project with Vite: `npm create vite@latest . -- --template react` (or `npx create-vite@latest`).
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

---

## 4. UI / UX Design Guidelines
- **Applicant Persona:** Requires high empathy, plain-language usage, soft friendly colors (blues/greens), and highly interactive widgets. Avoid all ML jargon.
- **Officer Persona:** Requires analytical depth, structured layouts, detailed data tables, alert styling (warning oranges/reds for bias), and a dense, information-rich view.

---

## 5. Pending / Future Requirements
*(Add any new features requested during active development here)*

- [ ] Ensure local `.env` setup securely handles the Gemini API key.
- [ ] Determine exact threshold for Bias Auditor triggers (e.g., > 5% variance across demographics).
