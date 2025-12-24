import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import ChatPage from './Pages/ChatPage';
import KnowledgeLibraryPage from './Pages/KnowledgeLibraryPage';
import ProjectsPage from './Pages/ProjectsPage';
import SettingsPage from './Pages/SettingsPage';
import LandingPage from './Pages/LandingPage';
import CheckoutPage from './Pages/CheckoutPage';
import InterestSelectionScreen from './Pages/InterestSelectionScreen';
import OnboardingIntroScreen from './Pages/OnboardingIntroScreen';
import SignInSignUpScreen from './Pages/SignInSignUpScreen';
import WalletPage from './Pages/WalletPage';
import ReferralPage from './Pages/ReferralPage';
import ProfilePage from './Pages/ProfilePage';
import { MenuIcon } from './Components/Icons';
import { ChatProvider } from './hooks/useZemenaiChat';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import EmailVerificationBanner from './Components/EmailVerificationBanner';

// This export is critical for Sidebar.tsx to function without errors
export type View = 'landing' | 'interests' | 'intro' | 'auth' | 'chat' | 'library' | 'projects' | 'settings' | 'checkout' | 'wallet' | 'referrals' | 'profile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onStart={() => setCurrentView('intro')} />;
      case 'intro': return <OnboardingIntroScreen onNext={() => setCurrentView('interests')} />;
      case 'interests': return <InterestSelectionScreen onComplete={() => setCurrentView('auth')} />;
      case 'auth': return <SignInSignUpScreen onToggle={() => setCurrentView('chat')} />;
      case 'chat': return <ChatPage />;
      case 'library': return <KnowledgeLibraryPage />;
      case 'projects': return <ProjectsPage />;
      case 'settings': return <SettingsPage />;
      case 'checkout': return <CheckoutPage />;
      case 'wallet': return <WalletPage />;
      case 'referrals': return <ReferralPage />;
      case 'profile': return <ProfilePage />;
      default: return <LandingPage onStart={() => setCurrentView('intro')} />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <ChatProvider>
          <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar with Desktop/Mobile visibility logic */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 transition-transform duration-300`}>
              <Sidebar currentView={currentView} onViewChange={(view) => {
                setCurrentView(view);
                setIsSidebarOpen(false);
              }} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 relative">
              <EmailVerificationBanner />

              {/* Mobile Header */}
              <header className="lg:hidden flex items-center p-4 border-b border-gray-800 bg-gray-900">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg">
                  <MenuIcon className="w-6 h-6" />
                </button>
                <span className="ml-4 font-bold text-xl text-blue-500">Zemen AI</span>
              </header>

              <main className="flex-1 overflow-hidden">
                {renderView()}
              </main>
            </div>
          </div>
        </ChatProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

// THIS LINE IS THE FIX FOR YOUR LOCAL BUILD ERROR
export default App;