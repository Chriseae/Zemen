
import React, { useState, useRef } from 'react';
import { SendIcon, LoadingIcon, MicrophoneIcon, MicrophoneSlashIcon, PlusIcon, XCircleIcon, FileIcon, ImageIcon, AudioIcon, VideoIcon } from './Icons';
import { Attachment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage: (content: string, attachments: Attachment[]) => Promise<void>;
  isLoading: boolean;
  isLiveActive: boolean;
  isLiveConnecting: boolean;
  toggleLive: () => void;
}

const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.wav,.mp4,.mov,.zip";

const ChatInput: React.FC<ChatInputProps> = ({ input, handleInputChange, sendMessage, isLoading, isLiveActive, isLiveConnecting, toggleLive }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading || hasLoadingAttachments) return;
    
    await sendMessage(input, attachments);
    setAttachments([]); // Clear attachments after sending
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);

      // Create placeholders with loading state
      const placeholders: Attachment[] = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        mimeType: file.type,
        type: getFileType(file.type),
        data: '',
        loading: true
      }));

      setAttachments(prev => [...prev, ...placeholders]);
      
      // Reset input immediately so change event fires even if same files selected
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Process files one by one (or Promise.all for parallel, but sequential feels safer for UI update flow)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const placeholderId = placeholders[i].id;

        try {
          const base64 = await convertToBase64(file);
          setAttachments(prev => prev.map(att => 
            att.id === placeholderId 
              ? { ...att, data: base64, loading: false } 
              : att
          ));
        } catch (error) {
          console.error(`Failed to read file ${file.name}`, error);
          // Remove failed attachment
          setAttachments(prev => prev.filter(att => att.id !== placeholderId));
        }
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const getFileType = (mime: string): Attachment['type'] => {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    return 'file';
  };

  const getFileIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'audio': return <AudioIcon className="w-4 h-4" />;
      case 'video': return <VideoIcon className="w-4 h-4" />;
      default: return <FileIcon className="w-4 h-4" />;
    }
  };

  const hasLoadingAttachments = attachments.some(a => a.loading);
  const isInputDisabled = isLoading || isLiveActive || isLiveConnecting;

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-1">
          {attachments.map(att => (
            <div key={att.id} className="relative group flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg pl-2 pr-8 py-1.5 text-xs text-gray-300">
               {att.loading ? (
                 <LoadingIcon className="w-5 h-5 text-blue-400" />
               ) : att.type === 'image' && att.data ? (
                 <img src={att.data} alt={att.name} className="w-5 h-5 object-cover rounded" />
               ) : (
                 getFileIcon(att.type)
               )}
               <span className="truncate max-w-[120px]" title={att.name}>{att.name}</span>
               <button 
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 p-1"
               >
                 <XCircleIcon className="w-4 h-4" />
               </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        {/* File Input - Hidden */}
        <input 
          type="file" 
          multiple 
          accept={ACCEPTED_FILE_TYPES}
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isInputDisabled}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
          title="Attach file"
        >
          <PlusIcon className="w-5 h-5" />
        </button>

        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLiveActive ? t('chat.listening') : t('chat.inputPlaceholder')}
          className={`w-full h-12 pl-12 pr-28 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto ${language === 'am' ? 'font-amharic' : ''}`}
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
            disabled={isInputDisabled || (!input.trim() && attachments.length === 0) || hasLoadingAttachments}
            className="w-9 h-9 flex items-center justify-center bg-blue-600 rounded-full text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            aria-label="Send message"
          >
            {isLoading ? <LoadingIcon className="h-5 w-5" /> : <SendIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
