import React from 'react';
import { SendIcon, LoadingIcon, MicrophoneIcon, MicrophoneSlashIcon } from './Icons.tsx';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isLiveActive: boolean;
  isLiveConnecting: boolean;
  toggleLive: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, handleInputChange, handleSubmit, isLoading, isLiveActive, isLiveConnecting, toggleLive }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const isInputDisabled = isLoading || isLiveActive || isLiveConnecting;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={isLiveActive ? "Listening..." : "ጥያቄዎን እዚህ ያስገቡ..."}
        className="w-full h-12 px-4 py-3 pr-28 bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto font-amharic"
        rows={1}
        disabled={isInputDisabled}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLive}
          disabled={isLoading}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors
            ${isLiveActive ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'}
            ${isLiveConnecting ? 'animate-pulse' : ''}
            disabled:bg-gray-700 disabled:cursor-not-allowed`}
          aria-label={isLiveActive ? 'Stop conversation' : 'Start conversation'}
        >
          {isLiveActive ? <MicrophoneSlashIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
        </button>
        <button
          type="submit"
          disabled={isInputDisabled || !input.trim()}
          className="w-9 h-9 flex items-center justify-center bg-blue-600 rounded-full text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          aria-label="Send message"
        >
          {isLoading ? <LoadingIcon className="h-5 w-5" /> : <SendIcon className="h-5 w-5" />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;