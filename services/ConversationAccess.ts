import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold, Modality } from "@google/genai";
import { Message } from '../types.ts';

// Support both standard Node process.env (for local/server) and Vite import.meta.env (for Vercel/Client)
const API_KEY = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable is not set. Please set VITE_API_KEY in Vercel.");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY || '' });

const conversationStore = new Map<string, Chat>();

const modelConfig = {
    model: 'gemini-3-pro-preview',
    config: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
    }
};

function createChat(history: Message[], systemPrompt: string): Chat {
    return genAI.chats.create({
        ...modelConfig,
        history: history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        })),
        config: {
            ...modelConfig.config,
            systemInstruction: systemPrompt,
        }
    });
}

export async function* streamChatResponse(sessionId: string, messages: Message[], systemPrompt: string) {
    let chat = conversationStore.get(sessionId);

    // If there's no chat, create one with the history minus the latest message.
    if (!chat) {
        const history = messages.slice(0, -1);
        chat = createChat(history, systemPrompt);
        conversationStore.set(sessionId, chat);
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
        return;
    }

    const result = await chat.sendMessageStream({ message: lastMessage.content });

    for await (const chunk of result) {
        yield chunk.text;
    }
}

export function deleteConversation(sessionId: string) {
    conversationStore.delete(sessionId);
}

// --- Audio / TTS Helpers ---

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function generateAmharicSpeech(text: string): Promise<ArrayBuffer> {
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: { parts: [{ text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data returned from model");
    }

    return decode(base64Audio).buffer;
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer): Promise<void> {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext({ sampleRate: 24000 }); // Gemini TTS usually outputs 24kHz

    // Decode the PCM data. 
    // Note: Gemini returns raw PCM. We need to convert it to an AudioBuffer.
    // However, the `Modality.AUDIO` response from `generateContent` is often raw PCM16LE.
    // The previous implementation for Live API used manual decoding. 
    // For simplicity here, we will reuse the logic similar to liveService.ts

    const dataView = new DataView(audioBuffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = audioBuffer.byteLength / 2; // 16-bit samples

    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32
        const sample = dataView.getInt16(i * 2, true); // Little endian
        channelData[i] = sample / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    return new Promise((resolve) => {
        source.onended = () => {
            ctx.close();
            resolve();
        };
    });
}