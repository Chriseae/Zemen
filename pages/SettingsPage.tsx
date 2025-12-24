import React, { useState, useRef, useEffect } from 'react';
import { SettingsIcon, UserIcon, BellIcon, ShieldIcon, CpuIcon, TrashIcon, BulbIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { ETHIOPIAN_LANGUAGES, Language, getStatusIcon } from '../locales/ethiopianLanguages';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">{title}</h3>
        <div className="bg-gray-800 rounded-xl border border-gray-700 divide-y divide-gray-700 overflow-hidden">
            {children}
        </div>
    </div>
);

const SettingItem: React.FC<{ icon: React.ReactNode; label: string; action: React.ReactNode }> = ({ icon, label, action }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-3 text-gray-200">
            <div className="text-gray-400">{icon}</div>
            <span className="font-medium">{label}</span>
        </div>
        <div>{action}</div>
    </div>
);

const Toggle: React.FC<{ checked?: boolean }> = ({ checked = false }) => (
    <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
    </div>
);

// Mother Tongue Selector Component with IMPROVED SCROLL
const MotherTongueSelector: React.FC<{
    currentLanguage: Language;
    onSelect: (lang: Language) => void;
    onClose: () => void;
}> = ({ currentLanguage, onSelect, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState(() =>
        ETHIOPIAN_LANGUAGES.findIndex(lang => lang.code === currentLanguage.code) || 0
    );
    const [isDragging, setIsDragging] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(() =>
        (ETHIOPIAN_LANGUAGES.findIndex(lang => lang.code === currentLanguage.code) || 0) * 60
    );
    const [velocity, setVelocity] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const lastTimeRef = useRef<number>(Date.now());
    const lastYRef = useRef<number>(0);
    const lastDeltasRef = useRef<number[]>([]);

    const ITEM_HEIGHT = 60;
    const VISIBLE_ITEMS = 5;
    const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);
    const FRICTION = 0.92; // Reduced friction for smoother scroll
    const MIN_VELOCITY = 0.05; // Lower threshold

    // Inertial scrolling with improved physics
    useEffect(() => {
        if (!isDragging && Math.abs(velocity) > MIN_VELOCITY) {
            const animate = () => {
                setVelocity(v => v * FRICTION);
                setScrollOffset(offset => {
                    const newOffset = offset + velocity;
                    const maxOffset = (ETHIOPIAN_LANGUAGES.length - 1) * ITEM_HEIGHT;
                    return Math.max(0, Math.min(maxOffset, newOffset));
                });

                if (Math.abs(velocity) > MIN_VELOCITY) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };
            animationRef.current = requestAnimationFrame(animate);

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            };
        }
    }, [velocity, isDragging]);

    // Snap to item
    useEffect(() => {
        if (!isDragging && Math.abs(velocity) < MIN_VELOCITY) {
            const nearestIndex = Math.round(scrollOffset / ITEM_HEIGHT);
            const targetOffset = nearestIndex * ITEM_HEIGHT;

            const snapAnimation = () => {
                setScrollOffset(current => {
                    const diff = targetOffset - current;
                    if (Math.abs(diff) < 0.5) {
                        setSelectedIndex(nearestIndex);
                        return targetOffset;
                    }
                    return current + diff * 0.15; // Smoother snap
                });

                if (Math.abs(scrollOffset - targetOffset) > 0.5) {
                    animationRef.current = requestAnimationFrame(snapAnimation);
                }
            };

            snapAnimation();
        }
    }, [isDragging, velocity, scrollOffset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setVelocity(0);
        lastYRef.current = e.clientY;
        lastTimeRef.current = Date.now();
        lastDeltasRef.current = [];
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const currentTime = Date.now();
        const deltaY = lastYRef.current - currentY;
        const deltaTime = currentTime - lastTimeRef.current;

        // Track last few deltas for smoother velocity
        if (deltaTime > 0) {
            const instantVelocity = (deltaY / deltaTime) * 16;
            lastDeltasRef.current.push(instantVelocity);
            if (lastDeltasRef.current.length > 5) lastDeltasRef.current.shift();

            // Average velocity for smoother feel
            const avgVelocity = lastDeltasRef.current.reduce((a, b) => a + b, 0) / lastDeltasRef.current.length;
            setVelocity(avgVelocity);
        }

        setScrollOffset(offset => {
            const newOffset = offset + deltaY;
            const maxOffset = (ETHIOPIAN_LANGUAGES.length - 1) * ITEM_HEIGHT;
            return Math.max(0, Math.min(maxOffset, newOffset));
        });

        lastYRef.current = currentY;
        lastTimeRef.current = currentTime;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setScrollOffset(offset => {
            const newOffset = offset + e.deltaY * 0.8; // More responsive
            const maxOffset = (ETHIOPIAN_LANGUAGES.length - 1) * ITEM_HEIGHT;
            return Math.max(0, Math.min(maxOffset, newOffset));
        });

        // Add slight momentum on wheel
        setVelocity(e.deltaY * 0.3);
    };

    const handleConfirm = () => {
        const selected = ETHIOPIAN_LANGUAGES[selectedIndex];
        onSelect(selected);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">Mother Tongue</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Scroll to select your preferred language
                </p>

                <div
                    ref={containerRef}
                    className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden select-none mb-6"
                    style={{ height: `${ITEM_HEIGHT * VISIBLE_ITEMS}px` }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <div
                        className="absolute left-0 right-0 bg-blue-600/20 border-y-2 border-blue-500 pointer-events-none z-10"
                        style={{
                            top: `${CENTER_INDEX * ITEM_HEIGHT}px`,
                            height: `${ITEM_HEIGHT}px`
                        }}
                    />

                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-20" />

                    <div
                        className="relative"
                        style={{
                            transform: `translateY(${CENTER_INDEX * ITEM_HEIGHT - scrollOffset}px)`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >
                        {ETHIOPIAN_LANGUAGES.map((lang, index) => {
                            const distanceFromCenter = Math.abs(scrollOffset / ITEM_HEIGHT - index);
                            const opacity = Math.max(0.2, 1 - distanceFromCenter * 0.3);
                            const scale = Math.max(0.85, 1 - distanceFromCenter * 0.08);

                            return (
                                <div
                                    key={lang.code}
                                    className="flex items-center justify-between px-6"
                                    style={{
                                        height: `${ITEM_HEIGHT}px`,
                                        opacity,
                                        transform: `scale(${scale})`,
                                        transition: isDragging ? 'none' : 'opacity 0.1s, transform 0.1s'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{getStatusIcon(lang.supportStatus)}</span>
                                        <div>
                                            <p className="text-white font-semibold text-lg">{lang.nativeName}</p>
                                            <p className="text-gray-400 text-xs">{lang.englishName}</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 text-xs uppercase">{lang.family}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4">
                    <p className="text-gray-400 text-xs mb-1">Selected:</p>
                    <p className="text-white text-xl font-bold">
                        {ETHIOPIAN_LANGUAGES[selectedIndex]?.nativeName}
                    </p>
                    <p className="text-gray-400 text-sm">
                        {ETHIOPIAN_LANGUAGES[selectedIndex]?.englishName} • {ETHIOPIAN_LANGUAGES[selectedIndex]?.family}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Confirm
                    </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-4">
                    🟢 Full Support • 🟡 Partial • ⚪ Planned (English Fallback)
                </p>
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const { t, language, changeLanguage, availableLanguages } = useLanguage();
    const fontClass = language === 'am' ? 'font-amharic' : '';
    const [showMotherTongueSelector, setShowMotherTongueSelector] = useState(false);
    const [motherTongue, setMotherTongue] = useState<Language>(() => {
        const saved = localStorage.getItem('zemenai_mother_tongue');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return ETHIOPIAN_LANGUAGES.find(l => l.code === 'am')!;
            }
        }
        return ETHIOPIAN_LANGUAGES.find(l => l.code === 'am')!;
    });

    const handleMotherTongueSelect = (lang: Language) => {
        setMotherTongue(lang);
        localStorage.setItem('zemenai_mother_tongue', JSON.stringify(lang));
        // If language is fully supported, switch UI to it
        if (lang.supportStatus === 'full') {
            changeLanguage(lang.code as any);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-6 overflow-y-auto">
            <header className="flex items-center gap-3 mb-8">
                <SettingsIcon className="w-8 h-8 text-gray-400" />
                <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('settings.title')}</h1>
            </header>

            <SettingsSection title={t('settings.sections.general')}>
                <SettingItem
                    icon={<UserIcon className="w-5 h-5" />}
                    label={t('settings.labels.account')}
                    action={<span className="text-sm text-gray-400">user@example.com</span>}
                />

                {/* Mother Tongue Selector with Bulb Icon and Translation */}
                <SettingItem
                    icon={<BulbIcon className="w-5 h-5" />}
                    label={t('settings.labels.motherTongue')}
                    action={
                        <button
                            onClick={() => setShowMotherTongueSelector(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 transition-colors ${fontClass}`}
                        >
                            <span>{getStatusIcon(motherTongue.supportStatus)}</span>
                            <span>{motherTongue.nativeName}</span>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    }
                />

                <SettingItem
                    icon={<span className="font-bold text-sm border border-gray-500 rounded px-1">EN</span>}
                    label={t('settings.labels.language')}
                    action={
                        <select
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value as any)}
                            className="bg-gray-900 text-gray-200 text-sm rounded-md border-gray-700 border px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {availableLanguages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label} {lang.flag}</option>
                            ))}
                        </select>
                    }
                />
            </SettingsSection>

            <SettingsSection title={t('settings.sections.model')}>
                <SettingItem
                    icon={<CpuIcon className="w-5 h-5" />}
                    label={t('settings.labels.aiModel')}
                    action={
                        <select className="bg-gray-900 text-gray-200 text-sm rounded-md border-gray-700 border px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                            <option>Gemini 3 Pro (Preview)</option>
                            <option>Zemen-LLM (Fine-tuned)</option>
                            <option>Gemini 2.5 Flash</option>
                        </select>
                    }
                />
                <SettingItem
                    icon={<ShieldIcon className="w-5 h-5" />}
                    label={t('settings.labels.memory')}
                    action={<Toggle checked />}
                />
            </SettingsSection>

            <SettingsSection title={t('settings.sections.data')}>
                <SettingItem
                    icon={<BellIcon className="w-5 h-5" />}
                    label={t('settings.labels.notifications')}
                    action={<Toggle checked={false} />}
                />
                <SettingItem
                    icon={<TrashIcon className="w-5 h-5" />}
                    label={t('settings.labels.clearData')}
                    action={
                        <button className={`px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors ${fontClass}`}>
                            {t('settings.labels.clearDataButton')}
                        </button>
                    }
                />
            </SettingsSection>

            {/* Mother Tongue Selector Modal */}
            {showMotherTongueSelector && (
                <MotherTongueSelector
                    currentLanguage={motherTongue}
                    onSelect={handleMotherTongueSelect}
                    onClose={() => setShowMotherTongueSelector(false)}
                />
            )}
        </div>
    );
};

export default SettingsPage;