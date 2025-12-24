import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// ZMX Transaction types
type TransactionType = 'reward' | 'purchase' | 'ai_training' | 'referral' | 'stake' | 'unstake' | 'transfer_in' | 'transfer_out';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  status: TransactionStatus;
  balance_after: number;
}

interface WalletData {
  zmx_balance: number;
  usd_value: number;
  staked_amount: number;
  rewards_earned: number;
  transactions: Transaction[];
  user_tier: 'free' | 'pro' | 'max';
}

const WalletPage: React.FC = () => {
  const { language, t } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [validatingEmail, setValidatingEmail] = useState(false);

  // API configuration
  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.zemenai.com'
    : 'http://localhost:8001';

  // ZMX Economics Configuration
  const ZMX_USD_RATE = 0.01; // $0.01 per ZMX

  // Calculate USD value
  const calculateUSDValue = (zmxAmount: number): number => {
    return zmxAmount * ZMX_USD_RATE;
  };

  // Starter amounts based on tier
  const STARTER_AMOUNTS = {
    free: 100,    // $1.00 worth
    pro: 2500,    // $25.00 worth
    max: 5000     // $50.00 worth
  };

  // Get current user ID (replace with actual auth)
  const getCurrentUserId = () => {
    // TODO: Get from auth context
    return localStorage.getItem('zemenai_user_id') || 'user_' + Date.now();
  };

  // Initialize user wallet if needed
  const initializeWallet = async (userId: string, tier: 'free' | 'pro' | 'max' = 'free') => {
    const starterAmounts = {
      free: 100,
      pro: 1000,
      max: 10000
    };

    try {
      // Check if wallet exists
      const existingWallet = localStorage.getItem(`wallet_${userId}`);

      if (!existingWallet) {
        // Create new wallet with starter amount based on tier
        const initialBalance = STARTER_AMOUNTS[tier];

        const newWallet: WalletData = {
          zmx_balance: initialBalance,
          usd_value: calculateUSDValue(initialBalance),
          staked_amount: 0,
          rewards_earned: 0,
          user_tier: tier,
          transactions: [
            {
              id: `tx_${Date.now()}_init`,
              type: 'reward',
              amount: initialBalance,
              description: `Welcome bonus - ${tier.toUpperCase()} tier (${calculateUSDValue(initialBalance).toFixed(2)} USD)`,
              timestamp: new Date(),
              status: 'completed',
              balance_after: initialBalance
            }
          ]
        };

        localStorage.setItem(`wallet_${userId}`, JSON.stringify(newWallet));
        return newWallet;
      }

      return JSON.parse(existingWallet);
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();

      // Try to fetch from backend first
      try {
        const response = await fetch(`${API_URL}/zmx/balance/${userId}`);
        const result = await response.json();

        if (result.success) {
          // Get transactions
          const transactionsResponse = await fetch(`${API_URL}/zmx/transactions/${userId}`);
          const transactionsResult = await transactionsResponse.json();

          setWalletData({
            zmx_balance: result.data.zmx_balance,
            usd_value: result.data.usd_value,
            staked_amount: result.data.staked_amount,
            rewards_earned: result.data.rewards_earned,
            transactions: transactionsResult.data || [],
            user_tier: 'free' // Get from user profile
          });
          return;
        }
      } catch (apiError) {
        console.log('Backend not available, using local storage');
      }

      // Fallback to local storage
      const userTier = (localStorage.getItem('zemenai_user_tier') || 'free') as 'free' | 'pro' | 'max';
      const wallet = await initializeWallet(userId, userTier);
      setWalletData(wallet);

    } catch (err) {
      setError('Failed to load wallet data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh wallet data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
  };

  // Add transaction to local wallet
  const addTransaction = (
    type: TransactionType,
    amount: number,
    description: string,
    status: TransactionStatus = 'completed'
  ) => {
    if (!walletData) return;

    const userId = getCurrentUserId();
    const newBalance = walletData.zmx_balance + (
      ['reward', 'purchase', 'ai_training', 'referral', 'transfer_in'].includes(type)
        ? amount
        : -amount
    );

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount: Math.abs(amount),
      description,
      timestamp: new Date(),
      status,
      balance_after: newBalance
    };

    const updatedWallet = {
      ...walletData,
      zmx_balance: newBalance,
      usd_value: calculateUSDValue(newBalance),
      transactions: [newTransaction, ...walletData.transactions]
    };

    localStorage.setItem(`wallet_${userId}`, JSON.stringify(updatedWallet));
    setWalletData(updatedWallet);
  };

  // Validate recipient email
  const validateRecipientEmail = async (email: string): Promise<boolean> => {
    if (!email || !email.includes('@')) {
      return false;
    }

    try {
      setValidatingEmail(true);

      // Call backend to check if email is registered
      const response = await fetch(`${API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
      const result = await response.json();

      return result.exists === true;
    } catch (error) {
      // Fallback: check localStorage for testing
      const registeredEmails = JSON.parse(localStorage.getItem('registered_emails') || '[]');
      return registeredEmails.includes(email.toLowerCase());
    } finally {
      setValidatingEmail(false);
    }
  };

  // Handle send ZMX
  const handleSendZMX = async () => {
    setSendError(null);

    const amount = parseFloat(sendAmount);

    if (!amount || amount <= 0) {
      setSendError(language === 'am' ? 'እባክዎ ትክክለኛ መጠን ያስገቡ' : 'Please enter a valid amount');
      return;
    }

    if (!walletData || amount > walletData.zmx_balance) {
      setSendError(language === 'am' ? 'በቂ ሂሳብ የለም' : 'Insufficient balance');
      return;
    }

    if (!recipientEmail) {
      setSendError(language === 'am' ? 'እባክዎ የተቀባዩን ኢሜይል ያስገቡ' : 'Please enter recipient email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      setSendError(language === 'am' ? 'ኢሜይል ትክክል አይደለም' : 'Invalid email format');
      return;
    }

    // Check if recipient is registered
    const isRegistered = await validateRecipientEmail(recipientEmail);
    if (!isRegistered) {
      setSendError(
        language === 'am'
          ? 'ይህ ኢሜይል በ ZemenAI አልተመዘገበም። ተቀባዩ መመዝገብ አለበት።'
          : 'This email is not registered with ZemenAI. Recipient must sign up first.'
      );
      return;
    }

    try {
      // In production: Call backend API
      addTransaction('transfer_out', amount, `Sent to ${recipientEmail}`, 'completed');

      setShowSendModal(false);
      setSendAmount('');
      setRecipientEmail('');
      setSendError(null);

      alert(
        language === 'am'
          ? `${amount} ZMX ወደ ${recipientEmail} በተሳካ ሁኔታ ተልኳል`
          : `Successfully sent ${amount} ZMX to ${recipientEmail}`
      );
    } catch (error) {
      console.error('Send failed:', error);
      setSendError(language === 'am' ? 'ግብይት አልተሳካም' : 'Transaction failed');
    }
  };

  // Handle stake
  const handleStake = async (amount: number) => {
    if (!walletData || amount > walletData.zmx_balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      // Call backend API
      const response = await fetch(`${API_URL}/zmx/stake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getCurrentUserId(),
          amount
        })
      });

      const result = await response.json();

      if (result.success) {
        addTransaction('stake', amount, `Staked ${amount} ZMX for rewards`, 'completed');
        await fetchWalletData();
      }
    } catch (error) {
      console.error('Stake failed:', error);
      alert('Staking failed');
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !walletData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load wallet'}</p>
          <button
            onClick={fetchWalletData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'reward':
      case 'ai_training':
      case 'referral':
        return '🎁';
      case 'purchase':
      case 'transfer_in':
        return '⬇️';
      case 'transfer_out':
        return '⬆️';
      case 'stake':
        return '🔒';
      case 'unstake':
        return '🔓';
      default:
        return '💰';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    return ['reward', 'purchase', 'ai_training', 'referral', 'transfer_in', 'unstake'].includes(type)
      ? 'text-green-400'
      : 'text-red-400';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl md:text-3xl font-bold text-white ${fontClass}`}>
            {language === 'am' ? 'ቦርሳ' : 'Wallet'}
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className={`text-gray-400 text-sm mb-1 ${fontClass}`}>
                {language === 'am' ? 'አጠቃላይ ቀሪ ሂሳብ' : 'Total Balance'}
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {walletData.zmx_balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </h2>
                <span className="text-xl text-blue-400 font-semibold">ZMX</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                ≈ ${walletData.usd_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase">
                {walletData.user_tier}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className={`text-gray-400 text-xs mb-1 ${fontClass}`}>
                {language === 'am' ? 'ተጨቁንኖዋል' : 'Staked'}
              </p>
              <p className="text-white font-semibold">
                {walletData.staked_amount.toLocaleString()} ZMX
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className={`text-gray-400 text-xs mb-1 ${fontClass}`}>
                {language === 'am' ? 'የጥረት ዋጋ' : 'Rewards Earned'}
              </p>
              <p className="text-green-400 font-semibold">
                +{walletData.rewards_earned.toLocaleString()} ZMX
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSendModal(true)}
              className={`py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${fontClass}`}
            >
              {language === 'am' ? 'ላክ' : 'Send'}
            </button>
            <button
              onClick={() => {
                const amount = prompt(language === 'am' ? 'የሚጨመር መጠን ያስገቡ:' : 'Enter amount to stake:');
                if (amount) handleStake(parseFloat(amount));
              }}
              className={`py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors ${fontClass}`}
            >
              {language === 'am' ? 'ጨምር' : 'Stake'}
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 md:p-6 border-b border-gray-700">
            <h2 className={`text-xl font-bold text-white ${fontClass}`}>
              {language === 'am' ? 'የቀደሞ ልውውጥ ገጽታ' : 'Transaction History'}
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {walletData.transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {language === 'am' ? 'ምንም ግብይት የለም' : 'No transactions yet'}
              </div>
            ) : (
              walletData.transactions.map((tx) => (
                <div key={tx.id} className="p-4 md:p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={`font-medium text-white ${fontClass}`}>
                            {tx.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionColor(tx.type)}`}>
                            {['reward', 'purchase', 'ai_training', 'referral', 'transfer_in', 'unstake'].includes(tx.type) ? '+' : '-'}
                            {tx.amount.toLocaleString()} ZMX
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {language === 'am' ? 'ቀሪ ሂሳብ' : 'Balance'}: {tx.balance_after.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {tx.status !== 'completed' && (
                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${tx.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                          }`}>
                          {tx.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className={`text-xs text-gray-500 text-center ${fontClass}`}>
          <strong>{language === 'am' ? 'ማስታወሻ:' : 'Note:'}</strong> {language === 'am' ? 'ZMX ወደ ጥሬ ገንዘብ መቀየር አይቻልም ለወደፊቱ በይፋ እስኪገለጽ ድረስ።' : 'ZMX is not redeemable for cash unless explicitly enabled in the future.'}
        </p>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
            <h3 className={`text-xl font-bold text-white mb-4 ${fontClass}`}>
              {language === 'am' ? 'ZMX ላክ' : 'Send ZMX'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm text-gray-400 mb-2 ${fontClass}`}>
                  {language === 'am' ? 'የተቀባዩ ኢሜይል' : 'Recipient Email'}
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'am' ? 'በ ZemenAI የተመዘገበ ኢሜይል ያስፈልጋል' : 'Must be registered with ZemenAI'}
                </p>
              </div>

              <div>
                <label className={`block text-sm text-gray-400 mb-2 ${fontClass}`}>
                  {language === 'am' ? 'መጠን' : 'Amount'}
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={walletData.zmx_balance}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'am' ? 'ይገኛል' : 'Available'}: {walletData.zmx_balance.toLocaleString()} ZMX
                </p>
              </div>

              {sendError && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className={`text-red-400 text-sm ${fontClass}`}>{sendError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSendError(null);
                  }}
                  className={`flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors ${fontClass}`}
                >
                  {language === 'am' ? 'ይቅር' : 'Cancel'}
                </button>
                <button
                  onClick={handleSendZMX}
                  disabled={validatingEmail}
                  className={`flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${fontClass}`}
                >
                  {validatingEmail
                    ? (language === 'am' ? 'በማረጋገጥ ላይ...' : 'Validating...')
                    : (language === 'am' ? 'ላክ' : 'Send')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;