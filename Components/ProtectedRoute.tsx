import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  onRedirectToAuth: () => void;
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  onRedirectToAuth,
  requireVerification = false 
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to access this page.</p>
          <button
            onClick={onRedirectToAuth}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (requireVerification && !currentUser.emailVerified) {
    const isOAuthUser = currentUser.providerData.some(
      provider => provider.providerId !== 'password'
    );

    if (!isOAuthUser) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verification Required</h2>
            <p className="text-gray-400 mb-6">
              Please verify your email address to access this feature. Check your inbox for a verification link.
            </p>
            <p className="text-sm text-gray-500">
              Email sent to: <span className="text-blue-400">{currentUser.email}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
