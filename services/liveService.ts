import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// --- Audio Utility Functions ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
// --- End Audio Utility Functions ---

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const BUFFER_SIZE = 4096;

// Define LiveSession type locally as it is not exported from the SDK
type LiveSession = Awaited<ReturnType<GoogleGenAI['live']['connect']>>;

interface LiveServiceCallbacks {
  onOpen: () => void;
  onClose: () => void;
  onError: (error: Error) => void;
  onTranscript: (user: string, assistant: string, isFinal: boolean) => void;
  onTurnComplete: (fullUserTranscript: string, fullAssistantTranscript: string) => void;
}

export class LiveConversationService {
  private ai: GoogleGenAI;
  private callbacks: LiveServiceCallbacks;
  private sessionPromise: Promise<LiveSession> | null = null;

  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private mediaStream: MediaStream | null = null;

  private outputSources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;

  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  constructor(callbacks: LiveServiceCallbacks) {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) throw new Error("VITE_API_KEY environment variable is not set");

    this.ai = new GoogleGenAI({ apiKey: API_KEY });
    this.callbacks = callbacks;
  }

  public async start(systemInstruction: string) {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` without TypeScript errors.
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` without TypeScript errors.
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });

      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: this.handleOpen,
          onmessage: this.handleMessage,
          onerror: this.handleError,
          onclose: this.handleClose,
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: systemInstruction,
        },
      });

    } catch (err) {
      console.error("Failed to start live session:", err);
      this.callbacks.onError(err instanceof Error ? err : new Error('Failed to get microphone permissions.'));
      this.close();
    }
  }

  public close() {
    this.sessionPromise?.then(session => session.close());
    this.cleanup();
  }

  private cleanup = () => {
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.scriptProcessor?.disconnect();
    this.inputAudioContext?.close().catch(console.error);
    this.outputAudioContext?.close().catch(console.error);

    this.scriptProcessor = null;
    this.mediaStream = null;
    this.inputAudioContext = null;
    this.outputAudioContext = null;
    this.sessionPromise = null;
  };

  private handleOpen = () => {
    if (!this.inputAudioContext || !this.mediaStream) {
      this.callbacks.onError(new Error("Audio context not initialized."));
      return;
    }

    const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

    this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
      const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      this.sessionPromise?.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);

    this.callbacks.onOpen();
  };

  private handleMessage = async (message: LiveServerMessage) => {
    if (message.serverContent?.outputTranscription) {
      this.currentOutputTranscription += message.serverContent.outputTranscription.text;
    }
    if (message.serverContent?.inputTranscription) {
      this.currentInputTranscription += message.serverContent.inputTranscription.text;
    }

    this.callbacks.onTranscript(this.currentInputTranscription, this.currentOutputTranscription, false);

    if (message.serverContent?.turnComplete) {
      this.callbacks.onTurnComplete(this.currentInputTranscription, this.currentOutputTranscription);
      this.currentInputTranscription = '';
      this.currentOutputTranscription = '';
    }

    if (message.serverContent?.interrupted) {
      for (const source of this.outputSources.values()) {
        source.stop();
        this.outputSources.delete(source);
      }
      this.nextStartTime = 0;
    }

    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
    if (base64Audio && this.outputAudioContext) {
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      const audioBuffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext, OUTPUT_SAMPLE_RATE, 1);

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioContext.destination);
      source.addEventListener('ended', () => {
        this.outputSources.delete(source);
      });
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.outputSources.add(source);
    }
  };

  private handleError = (e: ErrorEvent) => {
    console.error("Live session error:", e);
    this.callbacks.onError(new Error(e.message || 'An unknown connection error occurred.'));
    this.cleanup();
  };

  private handleClose = (e: CloseEvent) => {
    this.callbacks.onClose();
    this.cleanup();
  };
}