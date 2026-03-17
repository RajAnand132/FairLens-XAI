import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the SDK. 
// Note: In a production React app, you should NEVER expose your API key in the frontend. 
// This should be routed through a secure backend server. We are doing this client-side strictly for this prototype.
const getGenAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const translateXAI = async (factors, actionPlan) => {
  const ai = getGenAIClient();
  if (!ai) return { 
    explanation: "Personalized insights are currently unavailable as the AI service is initializing. Please try again shortly.", 
    empatheticActionPlan: actionPlan 
  };

  try {
    const prompt = `
      You are an empathetic financial advisor AI. A user's loan application was just reviewed by our ML algorithm. 
      
      Here are the specific feature weights (SHAP values) that influenced the decision:
      ${JSON.stringify(factors)}

      Here is the raw mathematical action plan to get approved:
      ${JSON.stringify(actionPlan)}

      Task: 
      3. Do not mention internal model names, technical providers, or mathematics (e.g., no mention of "Gemini", "weights", or "SHAP"). 
      4. Rewrite the action plan into a warm, encouraging bulleted list.

      Format the response strictly as JSON:
      {
        "explanation": "string",
        "empatheticActionPlan": ["string", "string"]
      }
    `;

    const modelName = import.meta.env.VITE_GEMINI_MODEL;
    const model = ai.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ]
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);

  } catch (error) {
    console.error("AI Insight Error:", error);
    return { 
      explanation: `We're currently experiencing high volume and couldn't generate your personalized insight. The standard action plan is provided below.`, 
      empatheticActionPlan: actionPlan 
    };
  }
};
