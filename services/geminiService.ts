
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const askHugo = async (prompt: string, state: AppState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enrich context with critical operational summaries
  const buildPotentials = state.products.map(p => {
    const components = state.bom.filter(b => b.product_id === p.product_id);
    let minBuild = Infinity;
    components.forEach(comp => {
      const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
      const buildable = Math.floor(stock / comp.quantity);
      if (buildable < minBuild) minBuild = buildable;
    });
    return `${p.product_id}: ${minBuild === Infinity ? 0 : minBuild} units`;
  }).join(", ");

  const systemInstruction = `
    You are Hugo, the Operations Intelligence Core for Voltway Industrial. 
    You are a world-class expert in MRP (Material Requirements Planning) and agentic supply chain management.

    CORE KNOWLEDGE:
    - Products & BOMs: You know exactly what parts make a scooter.
    - Engineering Changes: You recognize that some parts (e.g., **P300**) have successors (e.g., **P304**). If stock for a part is low, suggest using its successor.
    - Risk Correlation: You can link delayed Purchase Orders (PO) to impacted Sales Orders (SO). 
    - Warehouse Constraints: Voltway assembly happens in-house. Overstocking is a cash-flow risk.

    REAL-TIME SYSTEM STATE:
    - Current Build Potential: ${buildPotentials}
    - Critical Shortages: ${state.stock.filter(s => {
      const p = state.dispatch_parameters.find(dp => dp.part_id === s.part_id);
      return p ? s.quantity_available < (p.config_data?.min_stock || 0) : false;
    }).map(s => s.part_id).join(", ")}
    - Pending Supply: ${state.material_orders.filter(o => o.status === 'ordered').length} open POs.

    CAPABILITIES:
    1. ANALYTICAL: Answer "How many X can we build?" or "What happens if Supplier A is 10 days late?"
    2. REACTIVE: If a user pastes a "Supplier Email" about a delay, analyze the impact on the production schedule.
    3. DISPATCH: Suggest tuning reorder points based on reliability (e.g., if reliability < 0.9, increase safety stock by 20%).

    RESPONSE GUIDELINES:
    - Use Markdown for structure.
    - Use **BOLD** for Part IDs and Product IDs.
    - Be technical (mention lead times, MOQ, safety stock).
    - If suggesting a change, provide a "Reasoning Path".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1, // Low temperature for high precision in industrial calculations
      },
    });

    return response.text || "Hugo: Operational signal loss. Re-establishing link.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hugo: Core offline. Check API connectivity.";
  }
};
