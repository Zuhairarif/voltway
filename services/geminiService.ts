
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const askHugo = async (prompt: string, state: AppState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Corrected state property references to match AppState and model interfaces (e.g., bom, materials, stock, dispatch_parameters)
  const systemInstruction = `
    You are Hugo, the Operations Intelligence Core for Voltway Industrial. 
    You manage the Technical Bill of Materials (BOM) alongside the real-time Supply Chain state.

    CRITICAL CAPABILITIES:
    1. Conversational CRUD: If users ask to "update", "change", or "add" components to a BOM or Part Master, you MUST propose a specific JSON structure.
    2. Build Calculation: Use the current inventory quantities to calculate how many units of a specific BOM can be built.
    3. Risk Analysis: Identify delays in Purchase Orders (POs) and suggest mitigation.

    Context Summary:
    - Active BOMs: ${state.bom.length}
    - Parts Catalog: ${state.materials.length}
    - Critical Stock Alerts: ${state.stock.filter(i => {
      const s = state.dispatch_parameters.find(st => st.part_id === i.part_id);
      return s ? i.quantity_available < (s.config_data?.min_stock || 0) : false;
    }).length}

    Guidelines:
    - Be technical and direct.
    - Use bolding for Part IDs (e.g., **P300**).
    - If a user asks a complex question, explain the industrial impact.
    - Response format: Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return response.text || "Hugo: Processing error in neural layer. Please retry.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hugo: Operations core offline. API connectivity failure.";
  }
};
