import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmailVerificationBanner: React.FC = () => {
  const { currentUser, sendEmailVerification, reloadUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!currentUser || currentUser.emailVerified || dismissed) {
    return null;
  }

  const isOAuthUser = currentUser.providerData.some(
    provider => provider.providerId !== 'password'
  );
  if (isOAuthUser) return null;

  const handleSendVerification = async () => {
    setSending(true);
    try {
      await sendEmailVerification();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await reloadUser();
    } catch (error) {
      console.error('Failed to reload user:', error);
    }
  };

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1">
          <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-yellow-200">
            Please verify your email address to unlock all features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sent ? (
            <span className="text-sm text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Email sent!
            </span>
          ) : (
            <>
              <button
                onClick={handleSendVerification}
                disabled={sending}
                className="text-sm text-yellow-400 hover:text-yellow-300 font-medium disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Resend Email'}
              </button>
              <button
                onClick={handleCheckVerification}
                className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
              >
                I verified
              </button>
            </>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-400 hover:text-yellow-300 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
