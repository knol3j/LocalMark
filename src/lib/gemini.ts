import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const marketingModel = {
  async generateCopy(prompt: string, context?: string) {
    const systemInstruction = `
      You are a world-class marketing strategist and copywriter. 
      Your goal is to create compelling, high-converting marketing materials.
      Structure your response with clear sections: [Campaign Strategy], [Ad Copy], [Social Media Posts], [SEO Keywords].
      Use professional, persuasive language.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context ? `${context}\n\nUser Request: ${prompt}` : prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text;
  },

  async analyzeAssets(fileBase64: string, mimeType: string, prompt: string) {
    const systemInstruction = `
      You are a visual marketing expert. Analyze the provided image/asset and provide marketing insights.
      Suggest how this asset could be used in a campaign and provide copy that complements it.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: fileBase64, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction,
      },
    });

    return response.text;
  }
};
