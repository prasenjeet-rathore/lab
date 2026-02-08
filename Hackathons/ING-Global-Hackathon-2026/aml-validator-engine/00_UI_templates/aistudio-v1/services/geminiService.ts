import { GoogleGenAI } from "@google/genai";
import { CaseData } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const analyzeCase = async (caseData: CaseData, userQuery?: string) => {
  const ai = getClient();
  if (!ai) {
    return {
      text: "API Key not found. Please configure your environment variables.",
      sources: []
    };
  }

  const context = `
    You are an expert Anti-Money Laundering (AML) analyst assistant.
    Analyze the following case data:
    Entity: ${caseData.entityName}
    Risk Level: ${caseData.riskLevel}
    Risk Score: ${caseData.riskScore}
    Top Risk Drivers: ${caseData.topRiskDrivers.map(d => `${d.name} (${d.value})`).join(', ')}
    Transactions: ${JSON.stringify(caseData.transactions.map(t => ({
      date: t.date,
      amount: t.amount,
      sender: t.sender,
      receiver: t.receiver,
      type: t.type
    })))}
  `;

  const prompt = userQuery 
    ? `${context}\n\nUser Question: ${userQuery}\n\nProvide a concise, professional answer based on the data and general AML knowledge. If relevant, search for the entity name online to check for adverse media.`
    : `${context}\n\nProvide a high-level summary of the suspicious activity. Identify any potential red flags such as structuring, layering, or high-risk jurisdictions. Search the web for "${caseData.entityName}" to see if there is any adverse media or public records and include that in your analysis.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: 'application/json' // Not using JSON for free text chat
      }
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s: any) => s !== null);

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Error analyzing case data. Please try again.", sources: [] };
  }
};
