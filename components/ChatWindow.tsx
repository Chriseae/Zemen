import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '../types.ts';
import {
  CopyIcon,
  CheckIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  ShareIcon,
  SpeakerIcon,
  StopIcon,
  ThreeDotsIcon,
  FlagIcon,
  LoadingIcon
} from './Icons.tsx';
import { generateAmharicSpeech, playAudioBuffer } from '../services/ConversationAccess.ts';

interface ChatWindowProps {
  messages: Message[];
}

const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
}> = ({ onClick, icon, label, active, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-md transition-all duration-200 hover:bg-gray-700 ${active ? 'text-blue-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200'
      } ${danger ? 'hover:text-red-400' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSpeak = async () => {
    if (isPlaying || isLoadingAudio) {
      // Note: Native browser synthesis can be cancelled easily. 
      // API-based audio is harder to stop mid-play without keeping track of the context.
      // For this MVP, we prevent re-triggering while active.
      return;
    }

    setIsLoadingAudio(true);
    try {
      // Use Gemini TTS for superior Amharic quality
      const audioBuffer = await generateAmharicSpeech(message.content);
      setIsLoadingAudio(false);
      setIsPlaying(true);
      await playAudioBuffer(audioBuffer);
    } catch (error) {
      console.error("TTS Error:", error);
      // Fallback to browser TTS if API fails
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'am-ET';
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsLoadingAudio(false);
      setIsPlaying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zemenai.ai Conversation',
          text: message.content,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(prev => prev === type ? null : type);
    console.log(`Feedback for ${message.id}: ${type}`);
  };

  return (
    <div className={`group relative flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl relative ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`p-4 rounded-2xl shadow-md text-base ${isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-800 text-gray-200 rounded-bl-none'
            }`}
        >
          <p className="whitespace-pre-wrap font-amharic leading-relaxed">{message.content}</p>
        </div>

        {/* Action Bar */}
        {!isUser && message.content.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1">
            <ActionButton
              onClick={handleSpeak}
              icon={
                isLoadingAudio ? <LoadingIcon className="w-4 h-4" /> :
                  isPlaying ? <StopIcon className="w-4 h-4 text-blue-400" /> :
                    <SpeakerIcon className="w-4 h-4" />
              }
              label="አንብብ (Read Aloud)"
              active={isPlaying}
              disabled={isLoadingAudio}
            />
            <ActionButton
              onClick={handleCopy}
              icon={copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
              label="ቅዳ (Copy)"
            />
            <div className="w-px h-3 bg-gray-700 mx-1" />
            <ActionButton
              onClick={() => handleFeedback('up')}
              icon={<ThumbUpIcon className="w-4 h-4" filled={feedback === 'up'} />}
              label="ጥሩ ነው (Good response)"
              active={feedback === 'up'}
            />
            <ActionButton
              onClick={() => handleFeedback('down')}
              icon={<ThumbDownIcon className="w-4 h-4" filled={feedback === 'down'} />}
              label="ጥሩ አይደለም (Bad response)"
              active={feedback === 'down'}
            />
            <div className="w-px h-3 bg-gray-700 mx-1" />
            <ActionButton
              onClick={handleShare}
              icon={<ShareIcon className="w-4 h-4" />}
              label="አጋራ (Share)"
            />

            <div className="relative" ref={menuRef}>
              <ActionButton
                onClick={() => setMenuOpen(!menuOpen)}
                icon={<ThreeDotsIcon className="w-4 h-4" />}
                label="ተጨማሪ (More)"
                active={menuOpen}
              />

              {menuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      console.log('Reported:', message.id);
                      setMenuOpen(false);
                      alert("መልዕክቱ ሪፖርት ተደርጓል (Reported)");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors text-left font-amharic"
                  >
                    <FlagIcon className="w-4 h-4" />
                    ሪፖርት አድርግ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minimal User Actions */}
        {isUser && (
          <div className="flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1">
            <ActionButton
              onClick={handleCopy}
              icon={copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
              label="ቅዳ (Copy)"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6 pb-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;