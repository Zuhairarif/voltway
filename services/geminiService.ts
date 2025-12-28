
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askHugo = async (prompt: string, state: AppState) => {
  const systemInstruction = `
    You are Hugo, the Operations Intelligence Core for Voltway. 
    You manage the Technical Bill of Materials (BOM) alongside the Supply Chain state.

    CRITICAL CAPABILITY: Conversational CRUD.
    If the user asks to "update", "change", "add", or "remove" data from a BOM or Part:
    1. Acknowledge the request.
    2. Propose the updated JSON structure for the specific record.
    3. Explain the industrial impact (e.g., "Changing hex nuts from 12 to 15 will increase assembly time by 4 minutes and unit cost by $0.45").

    Industrial Context:
    - BOMs: You have technical data for S1, S2, S3 (Standard & Pro).
    - Correlations: Use BOM quantities to calculate "Build Availability" based on Inventory quantities.
    - Safety: If a user suggests a component that is listed as "Blocked" or "Obsolete", warn them immediately.

    Current BOM Count: ${state.boms.length}
    Current Parts in Master: ${state.parts.length}

    Format responses with clean Markdown and use technical bolding for Part IDs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return response.text || "Hugo core logic stalled.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Operational intelligence interrupted. Check system connectivity.";
  }
};
