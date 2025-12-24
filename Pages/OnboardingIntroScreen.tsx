
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SparklesIcon, ShieldIcon, TuneIcon } from '../components/Icons';

interface OnboardingIntroScreenProps {
  onConfirm: () => void;
}

const OnboardingIntroScreen: React.FC<OnboardingIntroScreenProps> = ({ onConfirm }) => {
  const { t, language } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';
  const [allowTraining, setAllowTraining] = useState(true);

  // Log event on mount
  useEffect(() => {
    console.log('Event: onboarding_intro_viewed');
  }, []);

  const handleToggle = () => {
    const newState = !allowTraining;
    setAllowTraining(newState);
    console.log('Event: allowTraining_toggle', { state: newState });
    localStorage.setItem('zemenai-allow-training', String(newState));
  };

  const handleConfirm = () => {
    console.log('Event: onboarding_intro_confirmed');
    onConfirm();
  };

  const InfoBlock: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="flex gap-4 text-left animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className={`text-lg font-semibold text-gray-100 mb-1 ${fontClass}`}>{title}</h3>
        <p className={`text-gray-400 text-sm leading-relaxed ${fontClass}`}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header */}
        <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${fontClass}`}>
          {t('onboarding.intro.title')}
        </h1>

        {/* Content Blocks */}
        <div className="space-y-6 bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800">
          <InfoBlock 
            icon={<SparklesIcon className="w-6 h-6" />}
            title={t('onboarding.intro.blocks.ask.title')}
            desc={t('onboarding.intro.blocks.ask.description')}
          />
          <InfoBlock 
            icon={<ShieldIcon className="w-6 h-6" />}
            title={t('onboarding.intro.blocks.safety.title')}
            desc={t('onboarding.intro.blocks.safety.description')}
          />
          <InfoBlock 
            icon={<TuneIcon className="w-6 h-6" />}
            title={t('onboarding.intro.blocks.improve.title')}
            desc={t('onboarding.intro.blocks.improve.description')}
          />

          {/* Training Toggle */}
          <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between">
            <span className={`text-sm font-medium text-gray-300 ${fontClass}`}>
              {t('onboarding.intro.toggleLabel')}
            </span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                allowTraining ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              role="switch"
              aria-checked={allowTraining}
              aria-label={t('onboarding.intro.toggleLabel')}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowTraining ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          className={`w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-transform active:scale-95 shadow-lg shadow-blue-900/10 ${fontClass}`}
          aria-label={t('onboarding.intro.cta')}
        >
          {t('onboarding.intro.cta')}
        </button>

      </div>
    </div>
  );
};

export default OnboardingIntroScreen;
