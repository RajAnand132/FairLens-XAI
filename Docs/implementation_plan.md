# XAI Loan Platform Implementation Plan

This plan covers the development of a Customer-Centric XAI Loan Platform, moving beyond "silent rejections" to provide transparent, AI-driven explanations and actionable guidance.

## User Review Required

> [!IMPORTANT]  
> The backend logic (Random Forest/XGBoost prediction, SHAP/LIME XAI) will be implemented as **mocked services/endpoints** on the frontend for this prototype, simulating the responses of real ML models. A real backend would require an extensive external server setup. Please confirm if simulating these APIs on the frontend side is acceptable for this prototype phase.
> 
> Additionally, please confirm if you will provide a **Gemini API Key** to power the live plain-language explanations, or if I should also mock that response based on static data.

## Proposed Changes

### Project Foundation
- Initialize a React web application using Vite in `e:\Program Files\JavaScript\Vite JS Projects\Customer-Centric XAI Loan Platform`.
- Use **Vanilla CSS** to construct a dynamic, highly polished design system (vibrant colors, glassmorphism, smooth animations, premium typography using Google Fonts like Inter or Outfit).

### Data Models & Mock Backend
- Create mock service functions (`src/services/mockApi.js`) to simulate:
  - **Prediction**: Approving or rejecting the loan based on inputs.
  - **XAI Engine (SHAP)**: Returning feature importance values mapping data attributes to rejection/approval likelihood.
  - **Counterfactuals**: Suggesting minimum changes required for approval (e.g., reduce debt by X amount).
  - **Fairness Audit**: Returning bias scores across demographics (Age, Gender, Ethnicity).
- Create `src/services/gemini.js` to:
  - Formulate prompts and communicate with the Gemini API to translate SHAP values and counterfactuals into empathetic, plain language.
  - Handle file uploads (PDF/Images) using Gemini's Multimodal/Vision capabilities to automatically extract and structure financial, demographic, and loan data, pre-filling the Applicant form.

### Components - Applicant View
- **Document Upload Zone**: A drag-and-drop area for users to upload loan discussions as PDFs or Images.
- **Data Input Form**: Capture Demographics, Financial Attributes, and Loan Details (auto-fillable via the document upload).
- **Status Dashboard**: Visual representation of "Rejected" or "Approved" with a Probability Gauge.
- **The "Why" Visualizer**: Bar charts showing factors influencing the decision and plain language explanations via Gemini.
- **Approval Improvement Simulator**: Interactive sliders allowing the user to tweak inputs (e.g., income, loan amount) and visualize the increase in approval chance dynamically.

### Components - Bank Officer View
- **Technical Analysis Panel**: Detailed feature importance rankings, quantitative SHAP values, and confidence levels.
- **Bias Alerts Monitoring**: Notifications if the fairness auditor flags potential discrimination based on inputs.

### Additional Innovative Features (Prototype Scope)
To make the prototype stand out as a highly engaging and complete solution, we will include the following advanced features:

#### 1. Financial Health Score (Applicant View)
Beyond just the binary "Approved/Rejected" status, the dashboard will calculate and display a holistic "Financial Health Grade" (e.g., A to F or a 0-100 score). This encourages long-term financial literacy even if the current loan is denied.

#### 2. Action Plan PDF Export (Applicant View)
After the Gemini AI generates the plain-language counterfactuals and advice, users will have a "Download My Action Plan" button to export a beautifully formatted PDF summarizing their personalized steps to secure loan approval in the future.

#### 3. Portfolio-Level Bias Dashboard (Bank Officer View)
A specialized view for the Bank Officer that goes beyond single applications. It will show macro-level fairness metrics (simulated over recent applications), ensuring the lending model remains unbiased across different demographic groups over time.

#### 4. "What-If" Life Event Simulator (Applicant View)
Allows users to select real-world "Life Events" (e.g., "Pay off car loan", "Get a 10% raise"). The simulator automatically calculates the new numbers, runs the mocked prediction, and Gemini explains exactly how that specific event improves their approval odds.

#### 5. "Next Best Offer" Alternative (Applicant View)
If their requested loan is rejected, the XAI engine works backward to find the maximum amount they could be approved for right now. The platform automatically presents this as a "Stepping Stone" alternative.

#### 6. Native Multi-Lingual Explanations (Applicant View)
A language dropdown that instantly translates complex financial feedback into various languages using the Gemini API, ensuring true accessibility.

#### 7. AI "Second Opinion" Chatbot (Officer View)
The Bank Officer has a chat interface linked to a specific loan application to ask Gemini questions like, "Why did the model weigh their age so heavily here?", helping to explain the model's interactions.

## Verification Plan

### Manual Verification
- Run the local dev server.
- Test the Applicant flow: input data -> receive rejection -> view XAI factors -> use simulator -> see updated hypothetical approval.
- Test the Bank Officer flow: verify technical scores, variable weights, and any triggered bias flags.
- Verify that the UI looks extremely premium, responsive, and matches modern aesthetic standards.
