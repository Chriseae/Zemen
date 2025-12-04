import React from 'react';
import ChatWindow from '../components/ChatWindow.tsx';
import ChatInput from '../components/ChatInput.tsx';
import { useZemenaiChat } from '../hooks/useZemenaiChat.ts';
import { ZemenaiIcon } from '../components/Icons.tsx';

const LiveTranscript: React.FC<{ user: string; assistant: string }> = ({ user, assistant }) => (
  <div className="space-y-4 mb-4 animate-pulse">
    {user && (
      <div className={`flex justify-end`}>
        <div className={`max-w-2xl p-4 rounded-2xl shadow-md bg-blue-600/80 text-white/90 rounded-br-none`}>
          <p className="whitespace-pre-wrap font-amharic leading-relaxed">{user}</p>
        </div>
      </div>
    )}
    {assistant && (
      <div className={`flex justify-start`}>
        <div className={`max-w-2xl p-4 rounded-2xl shadow-md bg-gray-800/80 text-gray-200/90 rounded-bl-none`}>
          <p className="whitespace-pre-wrap font-amharic leading-relaxed">{assistant}</p>
        </div>
      </div>
    )}
  </div>
);


const ChatPage: React.FC = () => {
  const { messages, input, isLoading, error, handleInputChange, handleSubmit, sessions, activeSessionId, liveState, toggleLiveConversation } = useZemenaiChat();

  if (sessions.length === 0 || !activeSessionId) {
    return (
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto items-center justify-center text-center">
        <ZemenaiIcon className="text-4xl" />
        <h2 className="text-2xl font-bold text-gray-400 mt-4">Welcome to Zemenai.ai</h2>
        <p className="text-gray-500 font-amharic">
          ለመጀመር በጎን በኩል <b>'አዲስ ውይይት'</b> የሚለውን ይጫኑ።
        </p>
      </div>
    )
  }

  const hasLiveTranscript = liveState.userTranscript || liveState.assistantTranscript;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <header className="p-4 border-b border-gray-700/50 md:hidden flex items-center">
        <ZemenaiIcon className="text-2xl" />
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <ChatWindow messages={messages} />
        {hasLiveTranscript && (
          <LiveTranscript user={liveState.userTranscript} assistant={liveState.assistantTranscript} />
        )}
      </div>
      <div className="p-4 md:p-6 bg-gray-900">
        {error && (
          <div className="mb-2 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        {liveState.error && (
          <div className="mb-2 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">
            <strong>Live Error:</strong> {liveState.error}
          </div>
        )}
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isLiveActive={liveState.isActive}
          isLiveConnecting={liveState.isConnecting}
          toggleLive={toggleLiveConversation}
        />
        <p className="text-center text-xs text-gray-500 mt-3 font-amharic">
          ዘመናይ ስህተት ሊሰራ ይችላል። እባክዎ ጠቃሚ መረጃዎችን ያረጋግጡ።
        </p>
      </div>
    </div>
  );
};

export default ChatPage;