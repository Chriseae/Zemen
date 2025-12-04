import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Message } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function* streamChatResponse(messages: Message[], systemPrompt: string) {
  // FIX: Use ai.chats.create which is the new recommended API for chat.
  // This replaces the deprecated `genAI.models[...]` and `model.startChat(...)` pattern.
  const chat = genAI.chats.create({
    model: 'gemini-2.5-pro',
    history: messages.slice(0, -1).map(msg => ({
      // FIX: Map 'assistant' role to 'model' for the new API.
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    // FIX: `generationConfig` is deprecated. Use `config` instead.
    // `systemInstruction` and `safetySettings` are now properties of `config`.
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.5,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    }
  });


  const lastMessage = messages[messages.length - 1];
  // FIX: `chat.sendMessageStream` in the new API returns a promise that resolves to an async generator.
  const result = await chat.sendMessageStream({ message: lastMessage.content });

  // FIX: Iterate over `result` directly, instead of `result.stream`.
  for await (const chunk of result) {
    // FIX: The response chunk has a `.text` property, not a `.text()` method in the new API.
    yield chunk.text;
  }
}
