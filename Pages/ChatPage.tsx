import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { useZemenaiChat } from '../hooks/useZemenaiChat';
import { ZemenaiIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

/* -------------------------------- Icons -------------------------------- */
const CodeIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ImageIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SplitIcon = ({ className = 'h-16 w-16' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4m10-2V6a2 2 0 00-2-2h-4m5 13V9m0 0L9 9" />
  </svg>
);

/* ----------------------------- Live Transcript ----------------------------- */
const LiveTranscript: React.FC<{ user?: string; assistant?: string }> = ({ user, assistant }) => (
  <div className="space-y-4 mb-6 animate-pulse">
    {user && (
      <div className="flex justify-end">
        <div className="max-w-2xl p-4 rounded-2xl bg-blue-600/80 text-white rounded-br-none">
          <p className="whitespace-pre-wrap font-amharic">{user}</p>
        </div>
      </div>
    )}
    {assistant && (
      <div className="flex justify-start">
        <div className="max-w-2xl p-4 rounded-2xl bg-gray-800/80 text-gray-200 rounded-bl-none">
          <p className="whitespace-pre-wrap font-amharic">{assistant}</p>
        </div>
      </div>
    )}
  </div>
);

/* -------------------------------- Canvas -------------------------------- */
const Canvas: React.FC<{
  content: { type: 'code' | 'image'; value: string } | null;
  onCopy?: () => void;
}> = ({ content, onCopy }) => {
  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <SplitIcon />
          <p className="mt-4 font-amharic">ካንቫስ</p>
          <p className="text-sm opacity-60 font-amharic">LLM output will appear here</p>
        </div>
      </div>
    );
  }

  if (content.type === 'code') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2 bg-gray-950 border-b border-gray-800">
          <span className="text-xs text-gray-400 font-mono">Generated Code</span>
          {onCopy && (
            <button onClick={onCopy} className="text-xs hover:text-blue-400">
              Copy
            </button>
          )}
        </div>
        <pre className="flex-1 overflow-auto bg-gray-950 text-green-400 p-4 text-sm font-mono">
          {content.value}
        </pre>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-900">
      <img src={content.value} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-lg" />
    </div>
  );
};

/* ================================ ChatPage ================================ */
const ChatPage: React.FC = () => {
  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    sendMessage,
    sessions,
    activeSessionId,
    liveState,
    toggleLiveConversation,
    activeModel
  } = useZemenaiChat();

  const { t, language } = useLanguage();
  const fontClass = language?.code === 'am' ? 'font-amharic' : '';

  const [splitView, setSplitView] = useState(false);
  const [canvas, setCanvas] = useState<{ type: 'code' | 'image'; value: string } | null>(null);

  /* -------- Auto-populate Canvas from assistant output -------- */
  useEffect(() => {
    if (!splitView || messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== 'assistant') return;

    if (last.content.includes('```')) {
      const code = last.content.split('```')[1] || '';
      setCanvas({ type: 'code', value: code.trim() });
    } else if (last.content.match(/https?:\/\/.*\.(png|jpg|jpeg|webp)/)) {
      setCanvas({ type: 'image', value: last.content.trim() });
    }
  }, [messages, splitView]);

  if (!sessions.length || !activeSessionId) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center">
        <ZemenaiIcon className="text-4xl" />
        <h2 className={`text-2xl mt-4 text-gray-400 ${fontClass}`}>{t('chat.welcomeTitle')}</h2>
        <p className={`text-gray-500 ${fontClass}`}>{t('chat.welcomeSubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">

      {/* ------------------------------- Header ------------------------------- */}
      <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
        <div className="text-sm text-gray-400 flex gap-2">
          <span>{activeModel?.icon}</span>
          <span className="font-medium">{activeModel?.name}</span>
          {activeModel?.description && (
            <span className="hidden md:inline opacity-60">— {activeModel.description}</span>
          )}
        </div>

        <button
          onClick={() => setSplitView(!splitView)}
          className={`px-4 py-2 rounded-lg text-sm ${splitView ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
        >
          {language?.code === 'am' ? 'ካንቫስ' : 'Canvas'}
        </button>
      </header>

      {/* ------------------------------- Content ------------------------------ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${splitView ? 'w-1/2 border-r border-gray-700/50' : 'max-w-3xl mx-auto'
            }`}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <ChatWindow messages={messages} />
            {(liveState.userTranscript || liveState.assistantTranscript) && (
              <LiveTranscript
                user={liveState.userTranscript}
                assistant={liveState.assistantTranscript}
              />
            )}
          </div>

          <div className="p-6 bg-gray-900">
            {error && (
              <div className="mb-2 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error.message}
              </div>
            )}
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              sendMessage={sendMessage}
              isLoading={isLoading}
              isLiveActive={liveState.isActive}
              isLiveConnecting={liveState.isConnecting}
              toggleLive={toggleLiveConversation}
            />
            <p className={`text-center text-xs text-gray-500 mt-3 ${fontClass}`}>
              {t('chat.disclaimer')}
            </p>
          </div>
        </div>

        {/* Canvas */}
        {splitView && (
          <div className="w-1/2 bg-gray-900">
            <Canvas
              content={canvas}
              onCopy={() => canvas && navigator.clipboard.writeText(canvas.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
