import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    linkWithPopup,
    unlink
} from 'firebase/auth';

const AccountLinking: React.FC = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    if (!currentUser) return null;

    const providers = currentUser.providerData.map(p => p.providerId);

    const isLinked = (providerId: string) => {
        return providers.includes(providerId);
    };

    const handleLink = async (providerType: 'google' | 'facebook' | 'apple') => {
        setLoading(providerType);
        setMessage('');

        try {
            let provider;
            switch (providerType) {
                case 'google':
                    provider = new GoogleAuthProvider();
                    break;
                case 'facebook':
                    provider = new FacebookAuthProvider();
                    break;
                case 'apple':
                    provider = new OAuthProvider('apple.com');
                    break;
            }

            await linkWithPopup(currentUser, provider);
            setMessage(`Successfully linked ${providerType} account!`);
        } catch (error: any) {
            if (error.code === 'auth/credential-already-in-use') {
                setMessage('This account is already linked to another currentUser.');
            } else if (error.code === 'auth/provider-already-linked') {
                setMessage('This provider is already linked to your account.');
            } else {
                setMessage(error.message || `Failed to link ${providerType} account`);
            }
        } finally {
            setLoading(null);
        }
    };

    const handleUnlink = async (providerId: string, providerName: string) => {
        if (providers.length === 1) {
            setMessage('Cannot unlink your only authentication method.');
            return;
        }

        setLoading(providerId);
        setMessage('');

        try {
            await unlink(currentUser, providerId);
            setMessage(`Successfully unlinked ${providerName} account!`);
        } catch (error: any) {
            setMessage(error.message || `Failed to unlink ${providerName} account`);
        } finally {
            setLoading(null);
        }
    };

    const getProviderIcon = (providerId: string) => {
        if (providerId.includes('google')) {
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            );
        }
        if (providerId.includes('facebook')) {
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        }
        if (providerId.includes('apple')) {
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        );
    };

    return (
        <div>
            {message && (
                <div className={`mb-4 px-4 py-3 rounded ${message.includes('Successfully')
                        ? 'bg-green-900 bg-opacity-50 border border-green-500 text-green-200'
                        : 'bg-red-900 bg-opacity-50 border border-red-500 text-red-200'
                    }`}>
                    {message}
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="text-white">{getProviderIcon('google.com')}</div>
                        <div>
                            <p className="font-medium text-white">Google</p>
                            <p className="text-sm text-gray-400">
                                {isLinked('google.com') ? 'Connected' : 'Not connected'}
                            </p>
                        </div>
                    </div>
                    {isLinked('google.com') ? (
                        <button
                            onClick={() => handleUnlink('google.com', 'Google')}
                            disabled={loading === 'google.com' || providers.length === 1}
                            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === 'google.com' ? 'Unlinking...' : 'Unlink'}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleLink('google')}
                            disabled={loading === 'google'}
                            className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
                        >
                            {loading === 'google' ? 'Linking...' : 'Link'}
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="text-white">{getProviderIcon('facebook.com')}</div>
                        <div>
                            <p className="font-medium text-white">Facebook</p>
                            <p className="text-sm text-gray-400">
                                {isLinked('facebook.com') ? 'Connected' : 'Not connected'}
                            </p>
                        </div>
                    </div>
                    {isLinked('facebook.com') ? (
                        <button
                            onClick={() => handleUnlink('facebook.com', 'Facebook')}
                            disabled={loading === 'facebook.com' || providers.length === 1}
                            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === 'facebook.com' ? 'Unlinking...' : 'Unlink'}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleLink('facebook')}
                            disabled={loading === 'facebook'}
                            className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
                        >
                            {loading === 'facebook' ? 'Linking...' : 'Link'}
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="text-white">{getProviderIcon('apple.com')}</div>
                        <div>
                            <p className="font-medium text-white">Apple</p>
                            <p className="text-sm text-gray-400">
                                {isLinked('apple.com') ? 'Connected' : 'Not connected'}
                            </p>
                        </div>
                    </div>
                    {isLinked('apple.com') ? (
                        <button
                            onClick={() => handleUnlink('apple.com', 'Apple')}
                            disabled={loading === 'apple.com' || providers.length === 1}
                            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading === 'apple.com' ? 'Unlinking...' : 'Unlink'}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleLink('apple')}
                            disabled={loading === 'apple'}
                            className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
                        >
                            {loading === 'apple' ? 'Linking...' : 'Link'}
                        </button>
                    )}
                </div>
            </div>

            {providers.length === 1 && (
                <p className="text-xs text-gray-400 mt-4">
                    Note: You cannot unlink your only authentication method.
                </p>
            )}
        </div>
    );
};

export default AccountLinking;
