
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircleIcon, SparklesIcon, CpuIcon, BookOpenIcon, UserIcon } from '../components/Icons';

interface InterestSelectionScreenProps {
  onComplete: () => void;
}

const InterestSelectionScreen: React.FC<InterestSelectionScreenProps> = ({ onComplete }) => {
  const { t, language } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // List of interests with basic icon mapping
  const interests = [
    { id: 'creative', icon: <SparklesIcon className="w-6 h-6" /> },
    { id: 'business', icon: <UserIcon className="w-6 h-6" /> },
    { id: 'education', icon: <BookOpenIcon className="w-6 h-6" /> },
    { id: 'health', icon: <UserIcon className="w-6 h-6" /> }, // Fallback icon
    { id: 'technology', icon: <CpuIcon className="w-6 h-6" /> },
    { id: 'history', icon: <BookOpenIcon className="w-6 h-6" /> },
    { id: 'culture', icon: <UserIcon className="w-6 h-6" /> },
    { id: 'news', icon: <BookOpenIcon className="w-6 h-6" /> },
  ];

  const handleToggle = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(prev => prev.filter(item => item !== id));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests(prev => [...prev, id]);
      }
    }
  };

  useEffect(() => {
    if (selectedInterests.length === 3) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500); // Slight delay for UX to see the selection checkmark
      return () => clearTimeout(timer);
    }
  }, [selectedInterests, onComplete]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-2xl w-full">
        <h1 className={`text-3xl font-bold text-white mb-3 ${fontClass}`}>
          {t('onboarding.interests.title')}
        </h1>
        <p className={`text-gray-400 mb-8 ${fontClass}`}>
          {t('onboarding.interests.subtitle')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {interests.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 aspect-square
                  ${isSelected 
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-blue-500">
                    <CheckCircleIcon className="w-5 h-5" filled />
                  </div>
                )}
                
                <div className={`mb-3 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                <span className={`font-medium text-sm ${fontClass}`}>
                  {t(`onboarding.interests.items.${item.id}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterestSelectionScreen;
