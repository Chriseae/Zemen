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

// Adding 'export' here is critical for the Sidebar to work
export type View = 'landing' | 'interests' | 'intro' | 'auth' | 'chat' | 'library' | 'projects' | 'settings' | 'checkout' | 'wallet' | 'referrals' | 'profile';