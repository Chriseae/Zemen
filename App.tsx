import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import ChatPage from './pages/ChatPage.tsx';
import { MenuIcon, BookOpenIcon, FolderIcon, SettingsIcon } from './components/Icons.tsx';
import { ChatProvider } from './hooks/useZemenaiChat.ts';

export type View = 'chat' | 'library' | 'projects' | 'settings';

// Define placeholder components here to avoid creating new files
const KnowledgeLibraryPage: React.FC = () => (
  <div className="flex flex-col h-full w-full items-center justify-center text-center p-8">
    <BookOpenIcon className="w-16 h-16 text-gray-600 mb-4" />
    <h2 className="text-3xl font-bold text-gray-300 font-amharic">የእውቀት ቤተ-መጽሐፍት</h2>
    <p className="mt-2 text-gray-500">
      This feature is currently under development.
    </p>
  </div>
);

const ProjectsPage: React.FC = () => (
  <div className="flex flex-col h-full w-full items-center justify-center text-center p-8">
    <FolderIcon className="w-16 h-16 text-gray-600 mb-4" />
    <h2 className="text-3xl font-bold text-gray-300 font-amharic">ፕሮጀክቶች</h2>
    <p className="mt-2 text-gray-500">
      This feature is currently under development.
    </p>
  </div>
);

const SettingsPage: React.FC = () => (
  <div className="flex flex-col h-full w-full items-center justify-center text-center p-8">
    <SettingsIcon className="w-16 h-16 text-gray-600 mb-4" />
    <h2 className="text-3xl font-bold text-gray-300 font-amharic">ቅንብሮች</h2>
    <p className="mt-2 text-gray-500">
      This feature is currently under development.
    </p>
  </div>
);


const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('chat');

  const renderContent = () => {
    switch (activeView) {
      case 'library':
        return <KnowledgeLibraryPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'chat':
      default:
        return <ChatPage />;
    }
  };

  return (
    <ChatProvider>
      <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-950 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
          <Sidebar
            closeSidebar={() => setSidebarOpen(false)}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </div>

        <div className="flex-1 flex flex-col relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-20 p-2 rounded-md text-gray-400 hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          {renderContent()}
        </div>
      </div>
    </ChatProvider>
  );
};

export default App;