import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, SettingsIcon, XIcon, ZemenaiIcon, ChatBubbleIcon, BookOpenIcon, FolderIcon, ThreeDotsIcon, TrashIcon } from './Icons.tsx';
import { useZemenaiChat } from '../hooks/useZemenaiChat.ts';
import { useLanguage } from '../contexts/LanguageContext';
import type { View } from '../App.tsx';

interface SidebarProps {
  closeSidebar: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, activeView, setActiveView }) => {
  const { sessions, activeSessionId, createNewSession, switchSession, deleteSession, renameSession } = useZemenaiChat();
  const { language, t } = useLanguage();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [starredSessions, setStarredSessions] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId]);

  const handleNewChat = () => {
    createNewSession();
    setActiveView('chat');
    closeSidebar();
  }

  const handleSwitchChat = (id: string) => {
    if (renamingId !== id) {
      switchSession(id);
      setActiveView('chat');
      closeSidebar();
    }
  }

  const handleViewChange = (view: View) => {
    setActiveView(view);
    closeSidebar();
  };

  const handleDeleteChat = (id: string) => {
    const confirmMessage = language === 'am'
      ? 'ይህንን የውይይት ክፍለ ጊዜ መሰረዝ ይፈልጋሉ? ይህ እርምጃ ሊቀለበስ አይችልም።'
      : 'Are you sure you want to delete this chat session? This action cannot be undone.';
    if (window.confirm(confirmMessage)) {
      deleteSession(id);
    }
    setMenuOpenFor(null);
  };

  const handleStarToggle = (id: string) => {
    setStarredSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setMenuOpenFor(null);
  };

  const handleAddToProject = (id: string) => {
    // TODO: Implement add to project functionality
    console.log('Add to project:', id);
    setMenuOpenFor(null);
  };

  const handleRenameStart = (session: typeof sessions[0]) => {
    setRenamingId(session.id);
    setRenameValue(session.title);
    setMenuOpenFor(null);
  }

  const handleRenameSubmit = () => {
    if (renamingId) {
      renameSession(renamingId, renameValue);
    }
    setRenamingId(null);
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-200 border-r border-gray-800">
      <div className="relative p-4 flex justify-center items-center border-b border-gray-800">
        <ZemenaiIcon className="text-3xl" />
        <button onClick={closeSidebar} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-800">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="h-5 w-5" />
          <span className="font-medium font-amharic">{t('sidebar.newChat')}</span>
        </button>
      </div>

      <div className="px-4 py-2 space-y-1 border-b border-gray-800 mb-2">
        <button
          onClick={() => handleViewChange('library')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'library' ? 'bg-gray-800' : ''}`}
        >
          <BookOpenIcon className="h-5 w-5 text-gray-400" />
          <span className="font-medium font-amharic">{t('sidebar.library')}</span>
        </button>
        <button
          onClick={() => handleViewChange('projects')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'projects' ? 'bg-gray-800' : ''}`}
        >
          <FolderIcon className="h-5 w-5 text-gray-400" />
          <span className="font-medium font-amharic">{t('sidebar.projects')}</span>
        </button>
        <button
          onClick={() => handleViewChange('wallet')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'wallet' ? 'bg-gray-800' : ''}`}
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="font-medium font-amharic">{t('sidebar.wallet')}</span>
        </button>
        <button
          onClick={() => handleViewChange('referrals')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'referrals' ? 'bg-gray-800' : ''}`}
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-medium font-amharic">{t('sidebar.referrals')}</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider font-amharic">{t('sidebar.recent')}</p>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleSwitchChat(session.id)}
            className={`group relative flex items-center justify-between gap-2 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${session.id === activeSessionId && activeView === 'chat' ? 'bg-gray-800' : ''
              }`}
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <ChatBubbleIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              {renamingId === session.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={handleRenameKeyDown}
                  className="bg-gray-700 text-white text-sm p-0.5 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <span className="font-medium text-sm truncate">{session.title}</span>
              )}
            </div>
            {renamingId !== session.id && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenFor(menuOpenFor === session.id ? null : session.id);
                  }}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Chat options"
                >
                  <ThreeDotsIcon className="h-4 w-4" />
                </button>
                {menuOpenFor === session.id && (
                  <div ref={menuRef} className="absolute z-10 right-0 top-full mt-1 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarToggle(session.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span className={starredSessions.has(session.id) ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                      <span className="font-amharic">{language === 'am' ? 'ምርጥ' : 'Star'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameStart(session);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span>✏️</span>
                      <span className="font-amharic">{t('sidebar.rename')}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToProject(session.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span>📁</span>
                      <span className="font-amharic">{language === 'am' ? 'ወደ ፕሮጀክት ጨምር' : 'Add to project'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(session.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      <span className="font-amharic">{t('sidebar.delete')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 mt-auto">
        <button
          onClick={() => handleViewChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 text-left ${activeView === 'settings' ? 'bg-gray-800' : ''}`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="font-medium font-amharic">{t('sidebar.settings')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;