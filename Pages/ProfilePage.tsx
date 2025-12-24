import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AccountLinking from '../components/AccountLinking';

interface UserProfile {
    displayName: string;
    bio: string;
    phone: string;
}

const ProfilePage: React.FC = () => {
    const { currentUser, signOut } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        displayName: currentUser?.displayName || '',
        bio: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, [currentUser]);

    const loadProfile = async () => {
        if (!currentUser) return;

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfile({
                    displayName: data.displayName || currentUser.displayName || '',
                    bio: data.bio || '',
                    phone: data.phone || ''
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentUser) return;

        setSaving(true);
        setMessage('');

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                displayName: profile.displayName,
                bio: profile.bio,
                phone: profile.phone,
                updatedAt: new Date()
            });

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            setMessage(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-400">Loading profile...</div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(profile.displayName || currentUser?.email || 'U')}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">{profile.displayName || 'currentUser'}</h2>
                        <p className="text-gray-400">{currentUser?.email}</p>
                        {currentUser?.emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-green-400 text-sm mt-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-yellow-400 text-sm mt-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Not Verified
                            </span>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`mb-4 px-4 py-3 rounded ${message.includes('success')
                            ? 'bg-green-900 bg-opacity-50 border border-green-500 text-green-200'
                            : 'bg-red-900 bg-opacity-50 border border-red-500 text-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell us about yourself..."
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-400 mt-1">{profile.bio.length}/200 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Connected Accounts</h3>
                <AccountLinking />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">currentUser ID:</span>
                        <span className="text-gray-300 font-mono">{currentUser?.uid}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Account Created:</span>
                        <span className="text-gray-300">
                            {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last Sign In:</span>
                        <span className="text-gray-300">
                            {currentUser?.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={signOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;
