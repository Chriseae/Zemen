
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeftIcon, LockIcon, CreditCardIcon, LoadingIcon, CheckIcon } from '../components/Icons';

// Use the public key provided
const STRIPE_PUBLIC_KEY = 'pk_test_51SDNNZHXgbxGHKRx2CvFW6Uc0AtrQldWPrcgIg3ky0Bz5XseVBPYlof9EntDxkcWWzI4sw57T3DIdmqTnEQMoUSS003zpIyb6n';

interface CheckoutPageProps {
  plan: 'pro' | 'max';
  billing: 'monthly' | 'yearly';
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, billing, onBack }) => {
  const { t, language } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);

  // Initialize Stripe.js
  useEffect(() => {
    // FIX: Cast window to any to access Stripe property which is loaded via external script.
    if ((window as any).Stripe) {
        // FIX: Cast window to any to access Stripe property.
        stripeRef.current = (window as any).Stripe(STRIPE_PUBLIC_KEY);
        const elements = stripeRef.current.elements();
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: '"Inter", sans-serif',
                },
            },
        });
        cardElement.mount('#card-element');
        elementsRef.current = elements;
    }
  }, []);

  // Calculate pricing based on plan and billing
  // Free: $0
  // Pro: $20/mo (monthly) or $17/mo (yearly)
  // Max: $120/mo (monthly) or $100/mo (yearly)
  
  let pricePerMonth = 0;
  let totalDue = 0;
  
  if (plan === 'pro') {
    pricePerMonth = billing === 'monthly' ? 20 : 17;
  } else if (plan === 'max') {
    pricePerMonth = billing === 'monthly' ? 120 : 100;
  }
  
  totalDue = billing === 'monthly' ? pricePerMonth : pricePerMonth * 12;

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      // Simulate network request to create payment intent and confirm
      // In a real app, this would call your backend which then calls Stripe
      setTimeout(() => {
          setIsProcessing(false);
          setPaymentSuccess(true);
      }, 2000);
  };

  if (paymentSuccess) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${fontClass}`}>{t('checkout.success')}</h1>
              <p className="text-gray-600 mb-8 max-w-md">
                Thank you for your subscription to the {plan === 'pro' ? 'Pro' : 'Max'} plan. Your account has been upgraded.
              </p>
              <button 
                onClick={onBack}
                className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${fontClass}`}
              >
                  {t('checkout.back')}
              </button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Panel: Order Summary */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-gray-100 border-r border-gray-200">
        <button 
          onClick={onBack} 
          className={`flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-12 ${fontClass}`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t('checkout.back')}
        </button>
        
        <div className="mb-8">
           <h2 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 ${fontClass}`}>{t('checkout.orderSummary')}</h2>
           <h1 className="text-4xl font-bold text-gray-900 mb-2">
             {plan === 'pro' ? t('landing.pricing.plan_pro.title') : t('landing.pricing.plan_max.title')} Plan
           </h1>
           <p className="text-xl text-gray-600">
             ${pricePerMonth} <span className="text-base text-gray-500">/ {t('landing.pricing.monthly').toLowerCase()}</span>
           </p>
           <p className={`text-sm text-gray-500 mt-1 ${fontClass}`}>
             {billing === 'yearly' ? t('landing.pricing.billedAnnually') : t('landing.pricing.billedMonthly')}
           </p>
        </div>

        <div className="border-t border-gray-300 pt-6">
           <div className="flex justify-between items-center mb-2">
             <span className={`text-gray-600 ${fontClass}`}>{t('checkout.billedNow')}</span>
             <span className="font-medium text-gray-900">${totalDue.toFixed(2)}</span>
           </div>
           <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-4">
             <span className={fontClass}>{t('checkout.total')}</span>
             <span>${totalDue.toFixed(2)}</span>
           </div>
        </div>
      </div>

      {/* Right Panel: Payment Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white">
        <div className="max-w-md mx-auto">
            <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${fontClass}`}>{t('checkout.payWithCard')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${fontClass}`}>{t('checkout.emailLabel')}</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900" placeholder="you@example.com" />
               </div>
               
               <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${fontClass}`}>{t('checkout.nameLabel')}</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" placeholder="Full Name" />
               </div>

               <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${fontClass}`}>{t('checkout.cardLabel')}</label>
                  <div className="p-4 border border-gray-300 rounded-lg bg-white">
                      <div id="card-element"></div>
                  </div>
               </div>

               <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${fontClass}`}>{t('checkout.countryLabel')}</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900">
                     <option>Ethiopia</option>
                     <option>United States</option>
                     <option>United Kingdom</option>
                     <option>Canada</option>
                  </select>
               </div>

               <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed ${fontClass}`}
               >
                  {isProcessing ? (
                      <>
                        <LoadingIcon className="w-5 h-5 text-white" />
                        {t('checkout.processing')}
                      </>
                  ) : (
                      <>
                        <LockIcon className="w-5 h-5" />
                        {t('checkout.payButton')}
                      </>
                  )}
               </button>
               
               <p className={`text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1 ${fontClass}`}>
                  <LockIcon className="w-3 h-3" /> {t('checkout.secure')}
               </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
