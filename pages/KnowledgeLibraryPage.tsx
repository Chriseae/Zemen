import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';

// Type Definitions
interface LibraryItem {
    id: string;
    title: string;
    type: 'document' | 'article' | 'summary';
    date: string;
    tags: string[];
    isPinned: boolean;
    size?: string;
    author?: string;
    userId: string;
    userName: string;
    fileUrl?: string;
    fileName?: string;
    mimeType?: string;
    processedStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    aiAnalysis?: {
        summary: string;
        keywords: string[];
        sentiment: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

interface UploadFile {
    id: string;
    file: File;
    status: 'waiting' | 'uploading' | 'processing' | 'training' | 'complete' | 'failed';
    progress: number;
    error?: string;
    coinReward?: number;
    uploadTask?: any;
    downloadUrl?: string;
}

// Simple Icon Components
const Icon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {children}
    </svg>
);

const SearchIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </Icon>
);

const UploadIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </Icon>
);

const BookIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </Icon>
);

const FileIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </Icon>
);

const EyeIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </Icon>
);

const TrashIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </Icon>
);

const DownloadIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </Icon>
);

const PinIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </Icon>
);

const CheckIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

const XIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

const AlertIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </Icon>
);

const LoaderIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </Icon>
);

const ArchiveIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </Icon>
);

const CloseIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </Icon>
);

const CoinIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

// Translation keys for the Knowledge Library
const translations: Record<string, { en: string; am: string }> = {
    'Knowledge Library': { en: 'Knowledge Library', am: 'የእውቀት ቤተ-መጽሐፍት' },
    'Manage and organize your knowledge resources': {
        en: 'Upload files, manage your content, and transform your data into personalized AI intelligence',
        am: 'ፋይሎችን ይጫኑ፣ ይዘትዎን ያስተዳድሩ፣ መረጃን ወደ ግል ኤአይ እውቀት ይለውጡ።'
    },
    'Upload Files': { en: 'Upload Files', am: 'ፋይሎችን ይስቀሉ' },
    'Search by title or tags...': { en: 'Search by title or tags...', am: 'በርዕስ ወይም በመለያዎች ይፈልጉ...' },
    'All': { en: 'All', am: 'ሁሉም' },
    'Documents': { en: 'Documents', am: 'ሰነዶች' },
    'Articles': { en: 'Articles', am: 'ጽሑፎች' },
    'Summaries': { en: 'Summaries', am: 'ማጠቃለያዎች' },
    'Error': { en: 'Error', am: 'ስህተት' },
    'Upload Progress': { en: 'Upload Progress', am: 'የስቀላ ሂደት' },
    'Complete': { en: 'Complete', am: 'ተጠናቅቋል' },
    'Failed': { en: 'Failed', am: 'አልተሳካም' },
    'Training AI': { en: 'Training AI', am: 'AI በማሰልጠን ላይ' },
    'Processing': { en: 'Processing', am: 'በማቀናበር ላይ' },
    'Loading knowledge base...': { en: 'Loading knowledge base...', am: 'የእውቀት ምንጭ በመጫን ላይ...' },
    'No items found': { en: 'No items found', am: 'ምንም ንጥሎች አልተገኙም' },
    'Try adjusting filters or upload new content': {
        en: 'Try adjusting filters or upload new content',
        am: 'ማጣሪያዎችን ማስተካከል ወይም አዲስ ይዘት መስቀል ይሞክሩ'
    },
    'View': { en: 'View', am: 'ይመልከቱ' },
    'Are you sure you want to delete this item?': {
        en: 'Are you sure you want to delete this item?',
        am: 'ይህን ንጥል መሰረዝ እርግጠኛ ኖት?'
    },
    'document': { en: 'document', am: 'ሰነድ' },
    'article': { en: 'article', am: 'ጽሑፍ' },
    'summary': { en: 'summary', am: 'ማጠቃለያ' },
    'History': { en: 'History', am: 'ታሪክ' },
    'Ethiopia': { en: 'Ethiopia', am: 'ኢትዮጵያ' },
    'Physics': { en: 'Physics', am: 'ፊዚክስ' },
    'Science': { en: 'Science', am: 'ሳይንስ' },
    'Adwa': { en: 'Adwa', am: 'ዓድዋ' },
    'Language': { en: 'Language', am: 'ቋንቋ' },
    'Education': { en: 'Education', am: 'ትምህርት' },
    'AI': { en: 'AI', am: 'ኤአይ' },
    'Technology': { en: 'Technology', am: 'ቴክኖሎጂ' },
    'Recent Upload': { en: 'Recent Upload', am: 'የቅርብ ጊዜ ስቀላ' },
    'Coins': { en: 'Coins', am: 'ሳንቲሞች' },
    'Pin': { en: 'Pin', am: 'ፒን' },
    'Unpin': { en: 'Unpin', am: 'ፒን አንሳ' },
    'Delete': { en: 'Delete', am: 'ሰርዝ' },
    'Processing AI Analysis': { en: 'Processing AI Analysis', am: 'AI ትንተና በማቀናበር ላይ' },
    'AI Analysis Complete': { en: 'AI Analysis Complete', am: 'AI ትንተና ተጠናቀቀ' },
    'Uploading to cloud...': { en: 'Uploading to cloud...', am: 'ወደ ክላውድ በመስቀል ላይ...' },
    'Training AI model...': { en: 'Training AI model...', am: 'AI ሞዴል በማሰልጠን ላይ...' },
};

// Utility Functions
const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const calculateCoinReward = (fileSize: number): number => {
    const baseMB = fileSize / (1024 * 1024);
    if (baseMB < 1) return 25;
    if (baseMB < 5) return 50;
    if (baseMB < 10) return 100;
    return 150;
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 50 * 1024 * 1024;
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    if (file.size > maxSize) {
        return { valid: false, error: 'File size exceeds 50MB limit' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
};

const KnowledgeLibraryPage: React.FC = () => {
    const { language, t: contextTranslate } = useLanguage();
    const { currentUser } = useAuth();

    const t = (key: string): string => {
        const contextResult = contextTranslate ? contextTranslate(key) : null;
        if (contextResult && contextResult !== key) {
            return contextResult;
        }
        return translations[key]?.[language] || key;
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'articles' | 'summaries'>('all');
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
    const [showUploadPanel, setShowUploadPanel] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const storage = getStorage();

    const fontClass = language === 'am' ? 'font-amharic' : '';

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            setError('Please log in to view your library');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const libraryQuery = query(
                collection(db, 'library'),
                where('userId', '==', currentUser.uid),);

            const unsubscribe = onSnapshot(
                libraryQuery,
                (snapshot) => {
                    const itemsData: LibraryItem[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        itemsData.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt?.toDate() || new Date(),
                            updatedAt: data.updatedAt?.toDate() || new Date(),
                        } as LibraryItem);
                    });

                    setItems(itemsData);
                    setIsLoading(false);
                    setError(null);
                },
                (error) => {
                    console.error('Error fetching library items:', error);

                    if (error.message.includes('index')) {
                        setError('Database index required. Please check the console for the index creation link, or contact support.');
                    } else {
                        setError(`Failed to load library items: ${error.message}`);
                    }
                    setIsLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (error: any) {
            console.error('Setup error:', error);
            setError(`Setup error: ${error.message}`);
            setIsLoading(false);
        }
    }, [currentUser]);

    const processUpload = useCallback(async (uploadItem: UploadFile) => {
        if (!currentUser) return;

        const updateStatus = (status: UploadFile['status'], progress: number, error?: string, coinReward?: number, downloadUrl?: string) => {
            setUploadQueue(prev =>
                prev.map(item =>
                    item.id === uploadItem.id
                        ? { ...item, status, progress, error, coinReward, downloadUrl }
                        : item
                )
            );
        };

        try {
            updateStatus('uploading', 10);

            const fileName = `${currentUser.uid}/${Date.now()}_${uploadItem.file.name}`;
            const fileRef = storageRef(storage, `library/${fileName}`);
            const uploadTask = uploadBytesResumable(fileRef, uploadItem.file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
                    updateStatus('uploading', 10 + progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    updateStatus('failed', 0, error.message);
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

                        updateStatus('processing', 60);
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        updateStatus('training', 75);
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        const coinReward = calculateCoinReward(uploadItem.file.size);

                        const libraryData = {
                            title: uploadItem.file.name.replace(/\.[^/.]+$/, ""),
                            type: uploadItem.file.type.includes('pdf') ? 'document' :
                                uploadItem.file.type.includes('image') ? 'article' : 'document',
                            date: new Date().toISOString().split('T')[0],
                            tags: ['Recent Upload'],
                            isPinned: false,
                            size: formatFileSize(uploadItem.file.size),
                            userId: currentUser.uid,
                            userName: currentUser.displayName || currentUser.email || 'User',
                            fileUrl: downloadUrl,
                            fileName: uploadItem.file.name,
                            mimeType: uploadItem.file.type,
                            processedStatus: 'completed' as const,
                            aiAnalysis: {
                                summary: 'AI analysis pending...',
                                keywords: [],
                                sentiment: 'neutral'
                            },
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        };

                        await addDoc(collection(db, 'library'), libraryData);

                        try {
                            const walletRef = doc(db, 'wallets', currentUser.uid);

                            await updateDoc(walletRef, {
                                balance: increment(coinReward),
                                totalEarned: increment(coinReward),
                                updatedAt: serverTimestamp()
                            }).catch(async (walletError: any) => {
                                if (walletError.code === 'not-found') {
                                    await setDoc(doc(db, 'wallets', currentUser.uid), {
                                        userId: currentUser.uid,
                                        balance: coinReward,
                                        totalEarned: coinReward,
                                        createdAt: serverTimestamp(),
                                        updatedAt: serverTimestamp()
                                    });
                                } else {
                                    throw walletError;
                                }
                            });

                            await addDoc(collection(db, 'transactions'), {
                                userId: currentUser.uid,
                                type: 'knowledge_contribution',
                                amount: coinReward,
                                description: `Data contribution: ${uploadItem.file.name}`,
                                status: 'completed',
                                createdAt: serverTimestamp()
                            });

                            updateStatus('complete', 100, undefined, coinReward, downloadUrl);

                        } catch (rewardError: any) {
                            console.error('Reward distribution error:', rewardError);
                            updateStatus('complete', 100, 'Upload succeeded but reward distribution failed', coinReward, downloadUrl);
                        }

                        setTimeout(() => {
                            setUploadQueue(prev => prev.filter(item => item.id !== uploadItem.id));
                        }, 3000);

                    } catch (dbError: any) {
                        console.error('Database error:', dbError);
                        updateStatus('failed', 0, dbError.message || 'Failed to save to database');
                    }
                }
            );

        } catch (e: any) {
            console.error("Upload process failed:", e);
            updateStatus('failed', 0, e.message || 'Upload failed');
        }
    }, [currentUser, storage]);

    useEffect(() => {
        uploadQueue.forEach(item => {
            if (item.status === 'waiting') {
                processUpload(item);
            }
        });
    }, [uploadQueue, processUpload]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const validFiles: UploadFile[] = [];
        const errors: string[] = [];

        Array.from(files).forEach(file => {
            const validation = validateFile(file);

            if (validation.valid) {
                validFiles.push({
                    id: generateId(),
                    file: file,
                    status: 'waiting',
                    progress: 0,
                });
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (validFiles.length > 0) {
            setUploadQueue(prev => [...prev, ...validFiles]);
            setShowUploadPanel(true);
        }

        if (errors.length > 0) {
            setError(errors.join('\n'));
            setTimeout(() => setError(null), 5000);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('Are you sure you want to delete this item?'))) return;

        try {
            await deleteDoc(doc(db, 'library', id));
        } catch (error: any) {
            console.error('Error deleting item:', error);
            setError('Failed to delete item: ' + error.message);
        }
    };

    const togglePin = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            await updateDoc(doc(db, 'library', id), {
                isPinned: !item.isPinned,
                updatedAt: serverTimestamp()
            });
        } catch (error: any) {
            console.error('Error toggling pin:', error);
            setError('Failed to update pin status');
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTab =
                activeTab === 'all' ||
                (activeTab === 'documents' && item.type === 'document') ||
                (activeTab === 'articles' && item.type === 'article') ||
                (activeTab === 'summaries' && item.type === 'summary');

            return matchesSearch && matchesTab;
        }).sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [items, searchTerm, activeTab]);

    const StatusIcon = ({ status }: { status: UploadFile['status'] }) => {
        const iconClass = 'w-5 h-5 mr-2';

        switch (status) {
            case 'complete':
                return <CheckIcon className={`${iconClass} text-green-500`} />;
            case 'failed':
                return <XIcon className={`${iconClass} text-red-500`} />;
            case 'waiting':
                return <FileIcon className={`${iconClass} text-gray-400`} />;
            default:
                return <LoaderIcon className={`${iconClass} text-blue-400 animate-spin`} />;
        }
    };

    const TypeIcon = ({ type }: { type: LibraryItem['type'] }) => {
        const iconClass = 'w-5 h-5 text-gray-400 mr-3 flex-shrink-0';

        switch (type) {
            case 'document':
                return <BookIcon className={iconClass} />;
            case 'article':
                return <FileIcon className={iconClass} />;
            case 'summary':
                return <EyeIcon className={iconClass} />;
            default:
                return <ArchiveIcon className={iconClass} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`${fontClass} text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
                            {t('Knowledge Library')}
                        </h1>
                        <p className={`${fontClass} text-gray-400 mt-2`}>{t('Manage and organize your knowledge resources')}</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`${fontClass} flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        <UploadIcon className="w-5 h-5" />
                        {t('Upload Files')}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        hidden
                        accept=".pdf,.doc,.docx,.txt,.md,.jpg,.png,.gif"
                    />
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
                    <div className="relative mb-6">
                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('Search by title or tags...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${fontClass} w-full py-3 pl-12 pr-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 transition-all`}
                        />
                    </div>

                    <div className="flex gap-2 border-b border-gray-700">
                        {(['all', 'documents', 'articles', 'summaries'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${fontClass} px-6 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${activeTab === tab
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-700/50 p-4 rounded-xl text-red-300 flex items-start gap-3 backdrop-blur-sm">
                        <AlertIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className={`${fontClass} font-semibold mb-1`}>{t('Error')}</p>
                            <p className={`${fontClass} text-sm whitespace-pre-line`}>{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {uploadQueue.length > 0 && showUploadPanel && (
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`${fontClass} text-xl font-bold text-gray-100`}>{t('Upload Progress')}</h2>
                            <button
                                onClick={() => setShowUploadPanel(false)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {uploadQueue.map(upload => (
                                <div
                                    key={upload.id}
                                    className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                                >
                                    <StatusIcon status={upload.status} />
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className={`${fontClass} text-sm font-medium text-gray-100 truncate`}>
                                            {upload.file.name}
                                        </p>
                                        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${upload.progress}%`,
                                                    backgroundColor: upload.status === 'failed' ? '#ef4444' : '#3b82f6'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`${fontClass} text-sm font-semibold ${upload.status === 'complete' ? 'text-green-400' :
                                                upload.status === 'failed' ? 'text-red-400' :
                                                    'text-blue-400'
                                                }`}
                                        >
                                            {upload.status === 'complete' ? t('Complete') :
                                                upload.status === 'failed' ? t('Failed') :
                                                    upload.status === 'training' ? t('Training AI') :
                                                        upload.status === 'processing' ? t('Processing') :
                                                            `${upload.progress}%`}
                                        </span>
                                        {upload.coinReward && (
                                            <div className={`${fontClass} text-sm font-bold text-yellow-400 mt-1 flex items-center gap-1`}>
                                                <CoinIcon className="w-4 h-4" />
                                                +{upload.coinReward} {t('Coins')}
                                            </div>
                                        )}
                                        {upload.status === 'failed' && upload.error && (
                                            <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-20">
                        <LoaderIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className={`${fontClass} text-gray-400 text-lg`}>{t('Loading knowledge base...')}</p>
                    </div>
                )}

                {!isLoading && filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <ArchiveIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className={`${fontClass} text-2xl font-semibold text-gray-300 mb-2`}>{t('No items found')}</h3>
                        <p className={`${fontClass} text-gray-500`}>{t('Try adjusting filters or upload new content')}</p>
                    </div>
                )}

                {!isLoading && filteredItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className={`${fontClass} flex items-center text-sm text-gray-400`}>
                                            <TypeIcon type={item.type} />
                                            <span className="capitalize">{t(item.type)}</span>
                                        </div>
                                        <button
                                            onClick={() => togglePin(item.id)}
                                            className={`transition-colors ${item.isPinned ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                                                }`}
                                        >
                                            <PinIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h3 className={`${fontClass} text-xl font-bold text-gray-100 line-clamp-2 leading-tight`}>
                                        {item.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className={`${fontClass} bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-800/50`}
                                            >
                                                {t(tag)}
                                            </span>
                                        ))}
                                    </div>

                                    <div className={`${fontClass} flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-700`}>
                                        <span>{item.date}</span>
                                        <span>{item.size}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button
                                        className={`${fontClass} flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors`}
                                        title={t('View')}
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        {t('View')}
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-green-400 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeLibraryPage;
