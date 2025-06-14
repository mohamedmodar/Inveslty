import express from 'express';
import "dotenv/config";

export const handleChat = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
        const result = await (ai.models as any).generateContent({
          model: "gemini-2.0-flash",
          systemInstruction: "You are an expert financial assistant for Investly, a platform that helps users invest in real estate, gold, and currency in Alexandria, Egypt. Your tone should be helpful, professional, and encouraging. Keep your responses concise and to the point.",
          contents: [{ parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 100,
          },
        });

        const text = result.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Error in chatbot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};