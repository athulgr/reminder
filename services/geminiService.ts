import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { ChatMessage } from '../types';
import { MessageSender } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatChatHistoryForAPI(history: ChatMessage[]) {
  return history.map(message => ({
    role: message.sender === MessageSender.User ? 'user' : 'model',
    parts: [{ text: message.text }]
  }));
}

export async function getAiResponse(history: ChatMessage[], newPrompt: string): Promise<string> {
  try {
    const formattedHistory = formatChatHistoryForAPI(history);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: newPrompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = result.text;
    if (!text) {
      return "I am speechless. Your mediocrity has broken me.";
    }
    return text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "The connection to your future is failing. Probably your fault.";
  }
}
