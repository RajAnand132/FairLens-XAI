# Abstract

## FairLens: A Customer-Centric Explainable AI Loan Assessment Platform

**Authors:** [Your Name(s)]
**Institution:** [Your College], [Your Department]
**Course:** [Course Name / Code]
**Date:** March 2026

---

Traditional automated loan approval systems operate as opaque black boxes — applicants learn the outcome but not the reasoning. This creates mistrust, inhibits financial self-improvement, and may perpetuate demographic bias. This paper presents **FairLens**, a web-based proof-of-concept that integrates Explainable AI (XAI) techniques with a Large Language Model (LLM) to deliver transparent, empathetic, and actionable loan assessments.

FairLens employs a SHAP (SHapley Additive exPlanations)-inspired factor attribution engine to decompose each lending decision into interpretable feature contributions across four key dimensions: Debt-to-Income ratio, capital adequacy, income-loan ratio, and credit index. These technical values are then translated into natural language explanations using Google's Gemini 1.5 Flash API, making the reasoning accessible to non-technical applicants. A real-time counterfactual simulator empowers applicants to interactively explore how adjustments to their financial parameters would affect their approval probability.

The platform features a dual-interface architecture: an empathetic applicant dashboard providing personalized improvement plans and a fairness badge, and an analytical officer dashboard surfacing bias alerts, technical SHAP matrices, and portfolio-level fairness metrics for institutional compliance. The frontend is implemented using React 18 and Vite 6 with a custom glassmorphic design system, requiring no backend infrastructure for prototype deployment.

Evaluation across ten test scenarios demonstrates consistent and statistically logical decision outputs, with real-time simulation responses under 5 milliseconds and Gemini API translation completing in 1.2–2.8 seconds. The project demonstrates that explainability and empathy are achievable design requirements in AI-driven financial services, not merely theoretical aspirations.

**Keywords:** Explainable AI (XAI), SHAP, Loan Assessment, Fairness Auditing, Large Language Models, Google Gemini, React, Glassmorphism, Counterfactual Simulation, Responsible AI

---

*Word count: 248*
