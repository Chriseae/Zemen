import React, { useState } from 'react';
import { ZemenaiIcon, CheckIcon, SponsorLogo } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
    onStart: () => void;
    onNavigate: (view: 'checkout', params?: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
    const { t, language } = useLanguage();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const fontClass = language === 'am' ? 'font-amharic' : '';

    const handleCheckout = (plan: 'pro' | 'enterprise') => {
        onNavigate('checkout', { plan, billing: billingCycle });
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col overflow-y-auto">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-950 z-50">
                <div className="flex items-center gap-2">
                    <ZemenaiIcon className="text-3xl" />
                </div>
                <button
                    onClick={onStart}
                    className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium ${fontClass}`}
                >
                    {t('landing.hero.cta')}
                </button>
            </nav>

            <main className="flex-1 flex flex-col items-center w-full">
                {/* Hero Section */}
                <section className="text-center pt-20 pb-12 px-4 max-w-4xl mx-auto w-full">
                    <h1 className={`text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 ${fontClass}`}>
                        {t('landing.pricing.title')}
                    </h1>
                    <p className={`text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
                        {t('landing.pricing.subtitle')}
                    </p>
                </section>

                {/* Pricing Toggle */}
                <div className="flex items-center justify-center mb-12 px-4">
                    <div className="bg-gray-800 p-1.5 rounded-full flex relative items-center">
                        {/* Sliding Background */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-600 rounded-full transition-all duration-300 ease-in-out shadow-sm ${billingCycle === 'monthly' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                        />

                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400 hover:text-gray-200'} ${fontClass}`}
                        >
                            {t('landing.pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400 hover:text-gray-200'} ${fontClass}`}
                        >
                            {t('landing.pricing.yearly')}
                            {/* Save Badge shown next to text */}
                            {billingCycle === 'yearly' && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold animate-pulse">
                                    {t('landing.pricing.saveBadge')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl px-6 w-full mb-20">
                    {/* Free Plan */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all flex flex-col shadow-lg">
                        <div className="mb-6">
                            <h3 className={`text-xl font-bold text-white mb-2 ${fontClass}`}>{t('landing.pricing.plan_free.title')}</h3>
                            <p className={`text-gray-400 text-sm h-10 ${fontClass}`}>{t('landing.pricing.plan_free.subtitle')}</p>
                        </div>
                        <div className="mb-8 h-16 flex flex-col justify-end">
                            <span className="text-4xl font-bold text-white">{t('landing.pricing.plan_free.price')}</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {(t('landing.pricing.plan_free.features') as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className={fontClass}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={onStart} className={`w-full py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium ${fontClass}`}>
                            {t('landing.pricing.plan_free.cta')}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-900 border border-blue-500/30 ring-1 ring-blue-500/30 rounded-2xl p-8 hover:border-blue-500 transition-all flex flex-col shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="mb-6">
                            <h3 className={`text-xl font-bold text-white mb-2 ${fontClass}`}>{t('landing.pricing.plan_pro.title')}</h3>
                            <p className={`text-gray-400 text-sm h-10 ${fontClass}`}>{t('landing.pricing.plan_pro.subtitle')}</p>
                        </div>
                        <div className="mb-8 h-16 flex flex-col justify-end">
                            <div className="flex items-baseline gap-1">
                                <span key={billingCycle} className="text-4xl font-bold text-white transition-opacity duration-300 animate-in fade-in">
                                    {billingCycle === 'monthly' ? t('landing.pricing.plan_pro.monthlyPrice') : t('landing.pricing.plan_pro.yearlyPrice')}
                                </span>
                                <span className={`text-sm text-gray-500 ${fontClass}`}>
                                    / {t('landing.pricing.monthly').toLowerCase()}
                                </span>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 transition-opacity duration-300 ${fontClass}`}>
                                {billingCycle === 'yearly' ? t('landing.pricing.billedAnnually') : t('landing.pricing.billedMonthly')}
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {(t('landing.pricing.plan_pro.features') as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span className={fontClass}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCheckout('pro')}
                            className={`w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium ${fontClass}`}
                        >
                            {t('landing.pricing.plan_pro.cta')}
                        </button>
                    </div>

                    {/* Max Plan */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all flex flex-col shadow-lg">
                        <div className="mb-6">
                            <h3 className={`text-xl font-bold text-white mb-2 ${fontClass}`}>{t('landing.pricing.plan_max.title')}</h3>
                            <p className={`text-gray-400 text-sm h-10 ${fontClass}`}>{t('landing.pricing.plan_max.subtitle')}</p>
                        </div>
                        <div className="mb-8 h-16 flex flex-col justify-end">
                            <div className="flex items-baseline gap-1">
                                <span key={billingCycle} className="text-4xl font-bold text-white transition-opacity duration-300 animate-in fade-in">
                                    {billingCycle === 'monthly' ? t('landing.pricing.plan_max.monthlyPrice') : t('landing.pricing.plan_max.yearlyPrice')}
                                </span>
                                <span className={`text-sm text-gray-500 ${fontClass}`}>
                                    / {t('landing.pricing.monthly').toLowerCase()}
                                </span>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 transition-opacity duration-300 ${fontClass}`}>
                                {billingCycle === 'yearly' ? t('landing.pricing.billedAnnually') : t('landing.pricing.billedMonthly')}
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {(t('landing.pricing.plan_max.features') as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckIcon className="w-5 h-5 text-purple-400 shrink-0" />
                                    <span className={fontClass}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCheckout('enterprise')}
                            className={`w-full py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium ${fontClass}`}
                        >
                            {t('landing.pricing.plan_max.cta')}
                        </button>
                    </div>
                </div>

                {/* Sponsors Footer */}
                <div className="w-full border-t border-gray-900 bg-gray-950 py-12">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <SponsorLogo name="HADERO" className="text-xl text-gray-200" />
                            <SponsorLogo name="OVID" className="text-xl text-gray-200" />
                            <SponsorLogo name="BOON" className="text-xl text-gray-200" />
                            <SponsorLogo name="BELESI" className="text-xl text-gray-200" />
                            <SponsorLogo name="FIGTREE" className="text-xl text-gray-200" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;