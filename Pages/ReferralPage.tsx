import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
    GiftIcon, UserPlusIcon, RocketIcon, CrownIcon, CopyIcon,
    CheckCircleIcon, ShareIcon, ClockIcon, CheckIcon, UserIcon
} from '../components/Icons';

interface ReferralData {
    userId: string;
    totalEarnings: number;
    activeReferrals: number;
    pendingRewards: number;
    rank: string;
    referralCode: string;
    referralLink: string;
    referrals: Referral[];
}

interface Referral {
    id: string;
    friendName: string;
    friendEmail: string;
    signupDate: string;
    plan: 'free' | 'pro' | 'max';
    reward: number;
    status: 'completed' | 'pending' | 'qualified';
    convertedDate?: string;
}

const ReferralPage: React.FC = () => {
    const { language, t } = useLanguage();
    const fontClass = language === 'am' ? 'font-amharic' : '';
    const [copied, setCopied] = useState(false);
    const [referralData, setReferralData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReferralData();
    }, []);

    const getCurrentUserId = () => {
        return localStorage.getItem('zemenai_user_id') || 'user_' + Date.now();
    };

    const generateReferralCode = (userId: string): string => {
        // Generate unique 8-character code from userId
        const hash = userId.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
    };

    const calculateRank = (totalEarnings: number): string => {
        if (totalEarnings >= 50000) return 'Diamond';
        if (totalEarnings >= 20000) return 'Platinum';
        if (totalEarnings >= 10000) return 'Gold';
        if (totalEarnings >= 5000) return 'Silver';
        return 'Bronze';
    };

    const loadReferralData = () => {
        const userId = getCurrentUserId();
        const saved = localStorage.getItem(`referral_data_${userId}`);

        if (saved) {
            setReferralData(JSON.parse(saved));
        } else {
            // Initialize new referral data
            const referralCode = generateReferralCode(userId);
            const newData: ReferralData = {
                userId,
                totalEarnings: 0,
                activeReferrals: 0,
                pendingRewards: 0,
                rank: 'Bronze',
                referralCode,
                referralLink: `https://zemenai.com/ref/${referralCode}`,
                referrals: []
            };

            localStorage.setItem(`referral_data_${userId}`, JSON.stringify(newData));
            setReferralData(newData);
        }

        setLoading(false);
    };

    const addRewardToWallet = (amount: number, description: string) => {
        const userId = getCurrentUserId();
        const walletKey = `wallet_${userId}`;
        const walletData = localStorage.getItem(walletKey);

        if (walletData) {
            const wallet = JSON.parse(walletData);
            const newBalance = wallet.zmx_balance + amount;

            // Create transaction
            const transaction = {
                id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'referral',
                amount: amount,
                description: description,
                timestamp: new Date(),
                status: 'completed',
                balance_after: newBalance
            };

            // Update wallet
            wallet.zmx_balance = newBalance;
            wallet.usd_value = newBalance * 0.01; // $0.01 per ZMX
            wallet.rewards_earned += amount;
            wallet.transactions = [transaction, ...wallet.transactions];

            localStorage.setItem(walletKey, JSON.stringify(wallet));
        }
    };

    const processReferralReward = (referral: Referral) => {
        if (!referralData) return;

        // Add reward to wallet
        addRewardToWallet(
            referral.reward,
            `Referral reward from ${referral.friendName} (${referral.plan.toUpperCase()} plan)`
        );

        // Update referral data
        const updatedData = {
            ...referralData,
            totalEarnings: referralData.totalEarnings + referral.reward,
            pendingRewards: referralData.pendingRewards - referral.reward,
            rank: calculateRank(referralData.totalEarnings + referral.reward),
            referrals: referralData.referrals.map(r =>
                r.id === referral.id ? { ...r, status: 'completed' as const } : r
            )
        };

        localStorage.setItem(`referral_data_${referralData.userId}`, JSON.stringify(updatedData));
        setReferralData(updatedData);
    };

    const handleCopyLink = () => {
        if (!referralData) return;

        navigator.clipboard.writeText(referralData.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareLink = () => {
        if (!referralData) return;

        const shareText = language === 'am'
            ? `ZemenAI ን ይቀላቀሉ እና የእኔን የሪፈራል ኮድ ይጠቀሙ: ${referralData.referralCode}`
            : `Join ZemenAI and use my referral code: ${referralData.referralCode}`;

        if (navigator.share) {
            navigator.share({
                title: 'ZemenAI Referral',
                text: shareText,
                url: referralData.referralLink
            });
        } else {
            handleCopyLink();
        }
    };

    const getPlanLabel = (plan: string) => {
        const labels: Record<string, { en: string; am: string }> = {
            free: { en: 'Free', am: 'ነጻ' },
            pro: { en: 'Pro', am: 'ፕሮ' },
            max: { en: 'Max', am: 'ማክስ' }
        };
        return labels[plan]?.[language] || plan;
    };

    const getRewardAmount = (plan: string): number => {
        const rewards: Record<string, number> = {
            free: 100,
            pro: 1000,
            max: 10000
        };
        return rewards[plan] || 0;
    };

    const getStatusDisplay = (status: string) => {
        const displays: Record<string, { icon: JSX.Element; label: string; labelAm: string; color: string }> = {
            completed: {
                icon: <CheckCircleIcon className="w-5 h-5" />,
                label: 'Paid',
                labelAm: 'ተከፍሏል',
                color: 'text-green-400'
            },
            qualified: {
                icon: <CheckCircleIcon className="w-5 h-5" />,
                label: 'Qualified',
                labelAm: 'ብቁ',
                color: 'text-blue-400'
            },
            pending: {
                icon: <ClockIcon className="w-5 h-5" />,
                label: 'Pending',
                labelAm: 'በመጠባበቅ ላይ',
                color: 'text-yellow-400'
            }
        };

        const display = displays[status] || displays.pending;
        return (
            <div className={`flex items-center gap-2 ${display.color}`}>
                {display.icon}
                <span className={fontClass}>{language === 'am' ? display.labelAm : display.label}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!referralData) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
                <p className="text-red-400">Failed to load referral data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-6 overflow-y-auto">
            <header className="mb-8 flex items-center gap-3">
                <GiftIcon className="w-8 h-8 text-purple-500" />
                <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('referrals.title')}</h1>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>
                        {t('referrals.stats.earnings')}
                    </p>
                    <p className="text-2xl font-bold text-white">
                        {referralData.totalEarnings.toLocaleString()} <span className="text-sm text-blue-400">ZMX</span>
                    </p>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>
                        {t('referrals.stats.active')}
                    </p>
                    <p className="text-2xl font-bold text-white">{referralData.activeReferrals}</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>
                        {t('referrals.stats.pending')}
                    </p>
                    <p className="text-2xl font-bold text-white">
                        {referralData.pendingRewards.toLocaleString()} <span className="text-sm text-yellow-400">ZMX</span>
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <CrownIcon className="w-12 h-12" />
                    </div>
                    <p className={`text-purple-300 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>
                        {t('referrals.stats.rank')}
                    </p>
                    <p className="text-2xl font-bold text-white">{referralData.rank}</p>
                </div>
            </div>

            {/* Link Sharing Box */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
                <h3 className={`text-lg font-bold text-white mb-4 ${fontClass}`}>
                    {t('referrals.linkBox.label')}
                </h3>
                <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate">
                        {referralData.referralLink}
                    </div>
                    <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${fontClass}`}
                    >
                        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                        {copied ? t('referrals.linkBox.copied') : t('referrals.linkBox.copy')}
                    </button>
                    <button
                        onClick={handleShareLink}
                        className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        <ShareIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className={`text-sm text-gray-500 ${fontClass}`}>{t('referrals.linkBox.footer')}</p>
            </div>

            {/* Reward Tiers */}
            <h2 className={`text-xl font-bold text-gray-200 mb-4 ${fontClass}`}>{t('referrals.rewards.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <UserPlusIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.signup')}</p>
                        <p className="text-sm text-gray-400">100 ZMX <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <RocketIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.pro')}</p>
                        <p className="text-sm text-gray-400">1,000 ZMX <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                        <CrownIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.max')}</p>
                        <p className="text-sm text-gray-400">10,000 ZMX <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <h2 className={`text-xl font-bold text-gray-200 mb-4 ${fontClass}`}>{t('referrals.table.title')}</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-8">
                {referralData.referrals.length === 0 ? (
                    <div className="p-8 text-center">
                        <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className={`text-gray-500 ${fontClass}`}>
                            {language === 'am'
                                ? 'እስካሁን ምንም ሪፈራሎች የሉም። ሊንክዎን ያጋሩ!'
                                : 'No referrals yet. Share your link to get started!'
                            }
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.friend')}</th>
                                <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.date')}</th>
                                <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.plan')}</th>
                                <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.reward')}</th>
                                <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50 text-sm">
                            {referralData.referrals.map((referral) => (
                                <tr key={referral.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-200">{referral.friendName}</td>
                                    <td className="px-6 py-4 text-gray-500">{referral.signupDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${referral.plan === 'max' ? 'bg-yellow-500/20 text-yellow-400' :
                                                referral.plan === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-gray-700 text-gray-400'
                                            }`}>
                                            {getPlanLabel(referral.plan)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-400">
                                        +{referral.reward.toLocaleString()} ZMX
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusDisplay(referral.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h3 className={`text-xl md:text-2xl font-bold text-white mb-4 max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
                    {t('referrals.cta.text')}
                </h3>
                <button
                    onClick={handleShareLink}
                    className={`px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg ${fontClass}`}
                >
                    {t('referrals.cta.button')}
                </button>
            </div>
        </div>
    );
};

export default ReferralPage;
