
import React, { useRef, useEffect, useState } from 'react';
import type { Message, Attachment } from '../types';
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
  LoadingIcon,
  FileIcon,
  AudioIcon,
  VideoIcon
} from './Icons';
import { generateAmharicSpeech, playAudioBuffer } from '../services/ConversationAccess';
import { useLanguage } from '../contexts/LanguageContext';

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
    className={`p-1.5 rounded-md transition-all duration-200 hover:bg-gray-700 ${
      active ? 'text-blue-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200'
    } ${danger ? 'hover:text-red-400' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

const AttachmentDisplay: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
  if (attachment.type === 'image') {
    return (
      <div className="mb-3 rounded-lg overflow-hidden border border-gray-700 max-w-xs sm:max-w-sm">
        <img src={attachment.data} alt={attachment.name} className="w-full h-auto" />
      </div>
    );
  }

  // Generic display for other files (Video/Audio/File)
  const Icon = attachment.type === 'video' ? VideoIcon : attachment.type === 'audio' ? AudioIcon : FileIcon;

  return (
    <div className="mb-2 flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg max-w-sm">
      <div className="p-2 bg-gray-800 rounded text-gray-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{attachment.name}</p>
        <p className="text-xs text-gray-500 uppercase">{attachment.type}</p>
      </div>
    </div>
  );
};

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fontClass = language === 'am' ? 'font-amharic' : '';

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
      return;
    }

    setIsLoadingAudio(true);
    try {
      const audioBuffer = await generateAmharicSpeech(message.content);
      setIsLoadingAudio(false);
      setIsPlaying(true);
      await playAudioBuffer(audioBuffer);
    } catch (error) {
      console.error("TTS Error:", error);
      // Fallback
      const utterance = new SpeechSynthesisUtterance(message.content);
      // Set lang based on content detection ideally, but here defaulting based on app intent
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
          className={`p-4 rounded-2xl shadow-md text-base ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-800 text-gray-200 rounded-bl-none'
          }`}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2">
              {message.attachments.map(att => (
                <AttachmentDisplay key={att.id} attachment={att} />
              ))}
            </div>
          )}

          <p className={`whitespace-pre-wrap leading-relaxed ${fontClass}`}>{message.content}</p>
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
              label={t('chat.actions.readAloud')}
              active={isPlaying}
              disabled={isLoadingAudio}
            />
            <ActionButton 
              onClick={handleCopy} 
              icon={copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />} 
              label={t('chat.actions.copy')}
            />
            <div className="w-px h-3 bg-gray-700 mx-1" />
            <ActionButton 
              onClick={() => handleFeedback('up')} 
              icon={<ThumbUpIcon className="w-4 h-4" filled={feedback === 'up'} />} 
              label={t('chat.actions.goodResponse')}
              active={feedback === 'up'}
            />
            <ActionButton 
              onClick={() => handleFeedback('down')} 
              icon={<ThumbDownIcon className="w-4 h-4" filled={feedback === 'down'} />} 
              label={t('chat.actions.badResponse')}
              active={feedback === 'down'}
            />
            <div className="w-px h-3 bg-gray-700 mx-1" />
            <ActionButton 
              onClick={handleShare} 
              icon={<ShareIcon className="w-4 h-4" />} 
              label={t('chat.actions.share')}
            />
            
            <div className="relative" ref={menuRef}>
              <ActionButton 
                onClick={() => setMenuOpen(!menuOpen)} 
                icon={<ThreeDotsIcon className="w-4 h-4" />} 
                label={t('chat.actions.more')}
                active={menuOpen}
              />
              
              {menuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                  <button 
                    onClick={() => {
                      console.log('Reported:', message.id);
                      setMenuOpen(false);
                      alert(t('chat.actions.reportSuccess'));
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors text-left ${fontClass}`}
                  >
                    <FlagIcon className="w-4 h-4" />
                    {t('chat.actions.report')}
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
              label={t('chat.actions.copy')} 
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
