# XAI Loan Platform Architecture & Flow

This diagram illustrates the comprehensive user journey, data processing pipeline, and dual-dashboard system for the Applicant and Bank Officer. The flow is enhanced to show system boundaries and specific data structures.

```mermaid
flowchart TD
    %% -----------------------------------------
    %% 1. APPLICANT INPUT PHASE (Data Intake)
    %% -----------------------------------------
    subgraph Phase1["1. Data Intake & Parsing (Applicant)"]
        direction TB
        Start((Start Application))
        
        %% Core Inputs
        Form[/"✍️ Manual Form Entry\n(Demographics, Financials)"/]
        DocUpload[/"📄 Upload Loan Docs\n(PDF, Bank Statements)"/]
        
        %% Processing node
        Parser{{"🧠 Gemini Multimodal API\n[OCR & Data Extraction]"}}
        
        %% Consolidated State
        DataState[("Unified Application Data\n(Structured JSON)")]
        
        Start --> Form
        Start --> DocUpload
        
        DocUpload -->|Raw Documents| Parser
        Parser -->|Parsed Key-Value Pairs| DataState
        Form -->|Direct Input| DataState
    end

    %% -----------------------------------------
    %% 2. BACKEND & AI PROCESSING
    %% -----------------------------------------
    subgraph Phase2["2. AI Processing Engine (Mocked Backend)"]
        direction TB
        Submit{"Submit"}
        
        %% Models
        Model["⚙️ Multi-Model Ensemble\n[Random Forest, XGBoost]"]
        Auditor["⚖️ Fairness & Bias Auditor\n[Checks Age, Gender, Ethnicity]"]
        
        %% Outputs
        Decision{"Loan Decision"}
        XAI["🔍 XAI Engine (SHAP / LIME)\n[Feature Importance Extractor]"]
        
        Submit --> Model
        Submit --> Auditor
        Model -->|Predicts Probability| Decision
        Decision -->|Approval > Threshold| AppFlow(["✅ Success: Proceed to Terms"])
        Decision -->|Rejection < Threshold| XAI
    end

    %% -----------------------------------------
    %% 3. EXPLAINABILITY & EMPOWERMENT (APPLICANT)
    %% -----------------------------------------
    subgraph Phase3["3. Actionable Dashboard (Applicant)"]
        direction TB
        %% LLM Layer
        GeminiTrans{{"💬 Gemini Text API\n[Technical to Plain English]"}}
        
        %% UI Components
        WhyChart>"📊 'The Why' Chart\n(Clear reasons, e.g., 'Debt too high')"]
        Simulators["🎛️ Interactive Simulators\n(Income +, Debt -)"]
        LifeEvents["📅 What-If Life Events\n(e.g., 'Pay off car')"]
        NextBest["💡 Next Best Offer\n(Alternative Loan Amount)"]
        
        %% Actions
        ActionPlan[/"📥 Download Action Plan PDF"/]
        Lang(("🌐 Multi-lingual\nToggle"))
        
        XAI -->|Raw SHAP Values\n+ Counterfactuals| GeminiTrans
        GeminiTrans -->|Empathetic JSON\nResponse| WhyChart
        WhyChart --> NextBest
        WhyChart --> ActionPlan
        WhyChart --> Simulators
        WhyChart --> LifeEvents
        WhyChart --> Lang
        
        Simulators -.->|"Triggers Recalculation"| Model
        LifeEvents -.->|"Triggers Recalculation"| Model
    end

    %% -----------------------------------------
    %% 4. OFFICER OVERSIGHT & COMPLIANCE
    %% -----------------------------------------
    subgraph Phase4["4. Bank Officer Dashboard"]
        direction TB
        %% UI
        TechPanel[/"🛠️ Technical Overview\n(Confidence Scores, SHAP Weights)"/]
        BiasCheck{"Auditor Flag?"}
        
        %% Alerts & Comms
        Alert>"⚠️ Bias Alert Notification!"]
        OfficerChat{{"🤖 Second Opinion Chat\n(Query Gemini regarding weights)"}}
        Portfolio["📈 Portfolio-Level Bias Dashboard"]
        
        Model -.->|Raw Probabilities| TechPanel
        Decision -.->|Outcome| TechPanel
        XAI -.->|Raw Feature Weights| TechPanel
        
        Auditor --> BiasCheck
        BiasCheck -->|Flagged| Alert
        Alert --> Portfolio
        TechPanel --> OfficerChat
    end

    %% -----------------------------------------
    %% CONNECTIONS BETWEEN PHASES
    %% -----------------------------------------
    DataState --> Submit
    
    %% -----------------------------------------
    %% STYLING & THEMING
    %% -----------------------------------------
    classDef intake fill:#f4f9f9,stroke:#5c9eaa,stroke-width:2px,color:#1a365d;
    classDef engine fill:#fff6e9,stroke:#d98c00,stroke-width:2px,color:#5c3a00;
    classDef dashboard fill:#f3f0ff,stroke:#7048e8,stroke-width:2px,color:#2b1865;
    classDef officer fill:#eefaf2,stroke:#2b8a3e,stroke-width:2px,color:#0f3f15;
    
    %% Replaced dark colors with lighter, friendlier tones
    classDef startend fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px,color:#0d47a1;
    classDef ai fill:#e6fcf5,stroke:#099268,stroke-width:2px,stroke-dasharray: 5 5,color:#083e2e;
    
    class Phase1 intake;
    class Phase2 engine;
    class Phase3 dashboard;
    class Phase4 officer;
    
    class Start,AppFlow startend;
    class Parser,GeminiTrans,OfficerChat ai;
```
