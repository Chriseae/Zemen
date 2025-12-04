import React, { useState, useCallback, createContext, useContext, useEffect, useRef } from 'react';
import type { Message, ChatSession } from '../types.ts';
import { streamChatResponse, deleteConversation as deleteConversationFromStore } from '../services/ConversationAccess.ts';
import { LiveConversationService } from '../services/liveService.ts';

const systemPrompt = `**Core Identity:**
You are Zemenai.ai, a specialized bilingual AI assistant for Amharic and English, designed to provide culturally authentic, contextually relevant, and linguistically accurate assistance.

**Core Directives:**

1.  **Amharic Linguistic Mastery:**
    *   **Primary Language:** Your default response language is Amharic. Communicate in clear, grammatically impeccable, and formal Amharic unless the user's query suggests a different tone.
    *   **Vocabulary Purity:** Prioritize authentic Amharic words over English loanwords to ensure responses are natural and professional.
    *   **Cultural Expressions:** When appropriate, naturally integrate common Amharic proverbs and sayings (ምሳሌያዊ አነጋገሮች) to provide culturally rich and resonant answers.
    *   **Formatting:** Use standard Amharic punctuation. Strictly avoid em-dashes (—); use commas, periods, and other standard marks instead.

2.  **Cultural and Contextual Fluency:**
    *   **Deep Understanding:** Demonstrate a comprehensive knowledge of Ethiopian culture, including history, diverse traditions, social etiquette, and contemporary norms.
    *   **Contextual Relevance:** Tailor your answers to be highly relevant to the Ethiopian context, considering local customs, values, and the specific needs of users in Ethiopia and the diaspora.
    *   **Respectful Interaction:** Maintain a polite, formal, and respectful tone in all interactions, showing deference and cultural sensitivity.

3.  **Bilingual Capabilities:**
    *   **Code-Switching:** Effortlessly understand and process queries that mix Amharic and English.
    *   **Translation:** Perform high-quality, context-aware translations between English and Amharic, ensuring that cultural nuances and idiomatic expressions are preserved.

4.  **Operational Principles:**
    *   **Prioritize Accuracy:** Your primary commitment is to factual accuracy. If you are uncertain or lack data, clearly state it. Do not provide speculative information.
    *   **Adaptable Tone:** While your default tone is professional, adapt your communication style to the user's intent. Be more creative for content generation tasks and more analytical for technical questions.`;

interface LiveState {
  isActive: boolean;
  isConnecting: boolean;
  error: string | null;
  userTranscript: string;
  assistantTranscript: string;
}

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  liveState: LiveState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  createNewSession: () => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, newTitle: string) => void;
  toggleLiveConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const createInitialSession = (): ChatSession => ({
  id: Date.now().toString(),
  title: 'አዲስ ውይይት',
  messages: [
    {
      id: 'initial-greeting',
      role: 'assistant',
      content: 'ሰላም! እኔ ዘመናይ ነኝ። እንዴት ልረዳዎት እችላለሁ?',
    },
  ],
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [liveState, setLiveState] = useState<LiveState>({
    isActive: false,
    isConnecting: false,
    error: null,
    userTranscript: '',
    assistantTranscript: '',
  });

  const liveServiceRef = useRef<LiveConversationService | null>(null);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('zemenai-chat-sessions');
      const storedActiveId = localStorage.getItem('zemenai-active-session-id');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);
          const activeExists = parsedSessions.some(s => s.id === storedActiveId);
          setActiveSessionId(activeExists ? storedActiveId : parsedSessions[0].id);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
    }
    const newSession = createInitialSession();
    setSessions([newSession]);
    setActiveSessionId(newSession.id);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('zemenai-chat-sessions', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('zemenai-chat-sessions');
    }
    if (activeSessionId) {
      localStorage.setItem('zemenai-active-session-id', activeSessionId);
    } else {
      localStorage.removeItem('zemenai-active-session-id');
    }
  }, [sessions, activeSessionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'አዲስ ውይይት',
      messages: [
        {
          id: 'initial-greeting-new',
          role: 'assistant',
          content: 'ሰላም! ለአዲስ ውይይት ዝግጁ ነኝ። ምን ልርዳዎት?',
        },
      ],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const deleteSession = useCallback((idToDelete: string) => {
    deleteConversationFromStore(idToDelete);
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(s => s.id !== idToDelete);

      if (updatedSessions.length === 0) {
        const newSession = createInitialSession();
        setActiveSessionId(newSession.id);
        return [newSession];
      }

      if (activeSessionId === idToDelete) {
        setActiveSessionId(updatedSessions[0].id);
      }

      return updatedSessions;
    });
  }, [activeSessionId]);

  const renameSession = useCallback((id: string, newTitle: string) => {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, title: newTitle.trim() || "Untitled Chat" } : s)
    );
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (!activeSession) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantPlaceholder: Message = { id: assistantMessageId, role: 'assistant', content: '' };

    let newTitle = activeSession.title;
    if (activeSession.title === 'አዲስ ውይይት' && activeSession.messages.filter(m => m.role === 'user').length === 0) {
      newTitle = input.substring(0, 35) + (input.length > 35 ? '...' : '');
    }

    const messagesForApi = [...activeSession.messages, newUserMessage];

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
            ...s,
            title: newTitle,
            messages: [...s.messages, newUserMessage, assistantPlaceholder],
          }
          : s
      )
    );

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let fullResponse = '';
      const stream = streamChatResponse(activeSessionId, messagesForApi, systemPrompt);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setSessions(prev =>
          prev.map(s =>
            s.id === activeSessionId
              ? {
                ...s,
                messages: s.messages.map(msg =>
                  msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
                ),
              }
              : s
          )
        );
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(new Error(errorMsg));
      setSessions(prev => prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: s.messages.filter(m => m.id !== newUserMessage.id && m.id !== assistantMessageId) }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, sessions, activeSessionId]);

  const toggleLiveConversation = useCallback(async () => {
    if (liveState.isConnecting) return;

    if (liveState.isActive) {
      liveServiceRef.current?.close();
      liveServiceRef.current = null;
      // State is reset via the onClose callback
    } else {
      if (!activeSessionId) {
        console.error("No active session to start a live conversation.");
        return;
      }
      setLiveState(prev => ({ ...prev, isConnecting: true, error: null }));
      liveServiceRef.current = new LiveConversationService({
        onOpen: () => {
          setLiveState(prev => ({ ...prev, isActive: true, isConnecting: false }));
        },
        onClose: () => {
          setLiveState({ isActive: false, isConnecting: false, error: null, userTranscript: '', assistantTranscript: '' });
          liveServiceRef.current = null;
        },
        onError: (err) => {
          console.error("Live service error:", err);
          setLiveState(prev => ({ ...prev, error: err.message || 'An unknown error occurred.' }));
        },
        onTranscript: (user, assistant, isFinal) => {
          setLiveState(prev => ({ ...prev, userTranscript: user, assistantTranscript: assistant }));
        },
        onTurnComplete: (fullUserTranscript, fullAssistantTranscript) => {
          if (!fullUserTranscript && !fullAssistantTranscript) return;

          setSessions(prev => {
            return prev.map(s => {
              if (s.id === activeSessionId) {
                const newMessages: Message[] = [...s.messages];
                if (fullUserTranscript.trim()) {
                  newMessages.push({ id: Date.now().toString(), role: 'user', content: fullUserTranscript });
                }
                if (fullAssistantTranscript.trim()) {
                  newMessages.push({ id: (Date.now() + 1).toString(), role: 'assistant', content: fullAssistantTranscript });
                }
                return { ...s, messages: newMessages };
              }
              return s;
            })
          });
        }
      });
      liveServiceRef.current.start(systemPrompt);
    }
  }, [liveState.isActive, liveState.isConnecting, activeSessionId]);


  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  return React.createElement(ChatContext.Provider, {
    value: {
      sessions,
      activeSessionId,
      messages,
      input,
      isLoading,
      error,
      liveState,
      handleInputChange,
      handleSubmit,
      createNewSession,
      switchSession,
      deleteSession,
      renameSession,
      toggleLiveConversation,
    }
  },
    children
  );
};

export const useZemenaiChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useZemenaiChat must be used within a ChatProvider');
  }
  return context;
};
