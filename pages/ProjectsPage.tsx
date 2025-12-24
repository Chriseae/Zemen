import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    doc,
    serverTimestamp,
    increment,
    Timestamp
} from 'firebase/firestore';

// Type Definitions
interface Project {
    id: string;
    title: string;
    description: string;
    status: 'planning' | 'development' | 'training' | 'testing' | 'deployed' | 'archived';
    progress: number;
    category: 'ai-model' | 'web-app' | 'mobile-app' | 'research' | 'automation';
    aiTrainingStatus?: {
        dataset: string;
        accuracy: number;
        epochs: number;
        isTraining: boolean;
        lastUpdated?: Date;
    };
    team: string[];
    teamIds: string[];
    ownerId: string;
    startDate: string;
    deadline?: string;
    rewards: {
        total: number;
        distributed: number;
        pending: number;
    };
    metrics: {
        commits: number;
        contributors: number;
        dataContributions: number;
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface ProjectTask {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'review' | 'completed';
    assigneeId?: string;
    assigneeName?: string;
    reward: number;
    deadline?: string;
    createdAt: Date;
    completedAt?: Date;
}

interface CreateProjectForm {
    title: string;
    description: string;
    category: Project['category'];
    deadline?: string;
    tags: string[];
    rewardBudget: number;
}

// Icon Components (keeping the same as before)
const Icon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {children}
    </svg>
);

const PlusIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </Icon>
);

const FolderIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </Icon>
);

const BrainIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </Icon>
);

const UsersIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </Icon>
);

const CoinIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

const CodeIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </Icon>
);

const ClockIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

const CheckIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </Icon>
);

const SearchIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </Icon>
);

const LoaderIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </Icon>
);

const XIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </Icon>
);

const ChartIcon = ({ className = '' }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </Icon>
);

// Translation Dictionary
const translations = {
    'Projects Hub': { en: 'Projects Hub', am: 'የፕሮጀክቶች ማዕከል' },
    'Manage development, training, and rewards': {
        en: 'Manage development, training, and rewards',
        am: 'ልማት፣ ስልጠና እና ሽልማቶችን ያስተዳድሩ'
    },
    'New Project': { en: 'New Project', am: 'አዲስ ፕሮጀክት' },
    'Search projects...': { en: 'Search projects...', am: 'ፕሮጀክቶችን ይፈልጉ...' },
    'All Projects': { en: 'All Projects', am: 'ሁሉም ፕሮጀክቶች' },
    'My Projects': { en: 'My Projects', am: 'የኔ ፕሮጀክቶች' },
    'All Tools': { en: 'All Tools', am: 'ሁሉም መሣሪያዎች' },
    'AI Models': { en: 'AI Models', am: 'AI ሞዴሎች' },
    'Web Apps': { en: 'Web Apps', am: 'ድረ-ገጽ መተግበሪያዎች' },
    'Mobile Apps': { en: 'Mobile Apps', am: 'ሞባይል መተግበሪያዎች' },
    'Research': { en: 'Research', am: 'ምርምር' },
    'Planning': { en: 'Planning', am: 'እቅድ' },
    'Development': { en: 'Development', am: 'ልማት' },
    'Training': { en: 'Training', am: 'ስልጠና' },
    'Testing': { en: 'Testing', am: 'ሙከራ' },
    'Deployed': { en: 'Deployed', am: 'ተሰማርቷል' },
    'Archived': { en: 'Archived', am: 'ተቀምጧል' },
    'Progress': { en: 'Progress', am: 'እድገት' },
    'Team': { en: 'Team', am: 'ቡድን' },
    'Rewards': { en: 'Rewards', am: 'ሽልማቶች' },
    'Contributors': { en: 'Contributors', am: 'አስተዋጽዖ አበርካቾች' },
    'Accuracy': { en: 'Accuracy', am: 'ትክክለኛነት' },
    'Training Active': { en: 'Training Active', am: 'ስልጠና ነቅቷል' },
    'View Details': { en: 'View Details', am: 'ዝርዝር ይመልከቱ' },
    'Commits': { en: 'Commits', am: 'ማስረከቢያዎች' },
    'Data Contributions': { en: 'Data Contributions', am: 'የመረጃ አስተዋፅኦ' },
    'Deadline': { en: 'Deadline', am: 'የማለቂያ ቀን' },
    'No projects found': { en: 'No projects found', am: 'ምንም ፕሮጀክቶች አልተገኙም' },
    'Try adjusting your search or filters': {
        en: 'Try adjusting your search or filters',
        am: 'ፍለጋዎን ወይም ማጣሪያዎችን ማስተካከል ይሞክሩ'
    },
    'Loading projects...': { en: 'Loading projects...', am: 'ፕሮጀክቶች በመጫን ላይ...' },
    'Create New Project': { en: 'Create New Project', am: 'አዲስ ፕሮጀክት ይፍጠሩ' },
    'Project Title': { en: 'Project Title', am: 'የፕሮጀክት ርዕስ' },
    'Description': { en: 'Description', am: 'መግለጫ' },
    'Category': { en: 'Category', am: 'ምድብ' },
    'Reward Budget': { en: 'Reward Budget', am: 'የሽልማት በጀት' },
    'Tags (comma separated)': { en: 'Tags (comma separated)', am: 'መለያዎች (በኮማ የተለዩ)' },
    'Cancel': { en: 'Cancel', am: 'ይቅር' },
    'Create Project': { en: 'Create Project', am: 'ፕሮጀክት ይፍጠሩ' },
    'Creating...': { en: 'Creating...', am: 'በመፍጠር ላይ...' },
    'Error creating project': { en: 'Error creating project', am: 'ፕሮጀክት መፍጠር አልተሳካም' },
    'Project created successfully!': { en: 'Project created successfully!', am: 'ፕሮጀክት በተሳካ ሁኔታ ተፈጥሯል!' }
};

const ProjectsPage: React.FC = () => {
    const { language, t: contextTranslate } = useLanguage();
    const { currentUser } = useAuth();

    const t = (key: string): string => {
        const contextResult = contextTranslate ? contextTranslate(key) : null;
        if (contextResult && contextResult !== key) return contextResult;
        return translations[key]?.[language] || key;
    };

    const fontClass = language === 'am' ? 'font-amharic' : '';

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [newProject, setNewProject] = useState<CreateProjectForm>({
        title: '',
        description: '',
        category: 'web-app',
        deadline: '',
        tags: [],
        rewardBudget: 1000
    });

    // Real-time Firebase listener for projects
    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Build query based on view mode
        let projectQuery;

        if (viewMode === 'my') {
            projectQuery = query(
                collection(db, 'projects'),
                where('teamIds', 'array-contains', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
        } else {
            projectQuery = query(
                collection(db, 'projects'),
                orderBy('createdAt', 'desc')
            );
        }

        const unsubscribe = onSnapshot(
            projectQuery,
            (snapshot) => {
                const projectsData: Project[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    projectsData.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                        aiTrainingStatus: data.aiTrainingStatus ? {
                            ...data.aiTrainingStatus,
                            lastUpdated: data.aiTrainingStatus.lastUpdated?.toDate()
                        } : undefined
                    } as Project);
                });
                setProjects(projectsData);
                setIsLoading(false);
            },
            (error) => {
                console.error('Error fetching projects:', error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser, viewMode]);

    // Create new project
    const handleCreateProject = async () => {
        if (!currentUser || !newProject.title.trim()) {
            setCreateError('Title is required');
            return;
        }

        setIsCreating(true);
        setCreateError(null);

        try {
            const projectData = {
                title: newProject.title.trim(),
                description: newProject.description.trim(),
                status: 'planning' as const,
                progress: 0,
                category: newProject.category,
                team: [currentUser.displayName || currentUser.email || 'User'],
                teamIds: [currentUser.uid],
                ownerId: currentUser.uid,
                startDate: new Date().toISOString().split('T')[0],
                deadline: newProject.deadline || null,
                rewards: {
                    total: newProject.rewardBudget,
                    distributed: 0,
                    pending: newProject.rewardBudget
                },
                metrics: {
                    commits: 0,
                    contributors: 1,
                    dataContributions: 0
                },
                tags: newProject.tags,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, 'projects'), projectData);

            // Reset form and close modal
            setNewProject({
                title: '',
                description: '',
                category: 'web-app',
                deadline: '',
                tags: [],
                rewardBudget: 1000
            });
            setShowCreateModal(false);

        } catch (error: any) {
            console.error('Error creating project:', error);
            setCreateError(error.message || 'Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    // Update project progress (example function)
    const updateProjectProgress = async (projectId: string, newProgress: number) => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                progress: newProgress,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    // Distribute rewards (example function)
    const distributeReward = async (projectId: string, userId: string, amount: number) => {
        try {
            // Update project rewards
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                'rewards.distributed': increment(amount),
                'rewards.pending': increment(-amount),
                updatedAt: serverTimestamp()
            });

            // Credit user wallet
            const walletRef = doc(db, 'wallets', userId);
            await updateDoc(walletRef, {
                balance: increment(amount),
                totalEarned: increment(amount),
                updatedAt: serverTimestamp()
            });

            // Create transaction record
            await addDoc(collection(db, 'transactions'), {
                userId,
                projectId,
                type: 'reward',
                amount,
                status: 'completed',
                createdAt: serverTimestamp()
            });

        } catch (error) {
            console.error('Error distributing reward:', error);
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch =
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [projects, searchTerm, statusFilter, categoryFilter]);

    const getStatusColor = (status: Project['status']) => {
        const colors = {
            planning: 'bg-gray-500/20 text-gray-300 border-gray-500',
            development: 'bg-blue-500/20 text-blue-300 border-blue-500',
            training: 'bg-purple-500/20 text-purple-300 border-purple-500',
            testing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
            deployed: 'bg-green-500/20 text-green-300 border-green-500',
            archived: 'bg-gray-700/20 text-gray-500 border-gray-700'
        };
        return colors[status];
    };

    const getCategoryIcon = (category: Project['category']) => {
        const iconClass = 'w-5 h-5';
        switch (category) {
            case 'ai-model': return <BrainIcon className={iconClass} />;
            case 'web-app': return <CodeIcon className={iconClass} />;
            case 'mobile-app': return <CodeIcon className={iconClass} />;
            case 'research': return <ChartIcon className={iconClass} />;
            case 'automation': return <CheckIcon className={iconClass} />;
            default: return <FolderIcon className={iconClass} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={`${fontClass} text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                            {t('Projects Hub')}
                        </h1>
                        <p className={`${fontClass} text-gray-400 mt-2`}>
                            {t('Manage development, training, and rewards')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className={`${fontClass} flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        <PlusIcon className="w-5 h-5" />
                        {t('New Project')}
                    </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`${fontClass} px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {t('All Projects')}
                    </button>
                    <button
                        onClick={() => setViewMode('my')}
                        className={`${fontClass} px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'my'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {t('My Projects')}
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('Search projects...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`${fontClass} w-full py-3 pl-12 pr-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400`}
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`${fontClass} px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100`}
                        >
                            <option value="all">{t('All Projects')}</option>
                            <option value="planning">{t('Planning')}</option>
                            <option value="development">{t('Development')}</option>
                            <option value="training">{t('Training')}</option>
                            <option value="testing">{t('Testing')}</option>
                            <option value="deployed">{t('Deployed')}</option>
                            <option value="archived">{t('Archived')}</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={`${fontClass} px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100`}
                        >
                            <option value="all">{t('All Tools')}</option>
                            <option value="ai-model">{t('AI Models')}</option>
                            <option value="web-app">{t('Web Apps')}</option>
                            <option value="mobile-app">{t('Mobile Apps')}</option>
                            <option value="research">{t('Research')}</option>
                            <option value="automation">Automation</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-20">
                        <LoaderIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className={`${fontClass} text-gray-400 text-lg`}>{t('Loading projects...')}</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <FolderIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className={`${fontClass} text-2xl font-semibold text-gray-300 mb-2`}>
                            {t('No projects found')}
                        </h3>
                        <p className={`${fontClass} text-gray-500`}>
                            {t('Try adjusting your search or filters')}
                        </p>
                    </div>
                )}

                {/* Projects Grid */}
                {!isLoading && filteredProjects.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProjects.map(project => (
                            <div
                                key={project.id}
                                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-xl"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                                            {getCategoryIcon(project.category)}
                                        </div>
                                        <div>
                                            <h3 className={`${fontClass} text-xl font-bold text-gray-100`}>
                                                {project.title}
                                            </h3>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusColor(project.status)}`}>
                                                {t(project.status.charAt(0).toUpperCase() + project.status.slice(1))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className={`${fontClass} text-gray-400 text-sm mb-4 line-clamp-2`}>
                                    {project.description}
                                </p>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className={`${fontClass} text-gray-400`}>{t('Progress')}</span>
                                        <span className={`${fontClass} text-blue-400 font-semibold`}>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {project.aiTrainingStatus && (
                                    <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BrainIcon className="w-4 h-4 text-purple-400" />
                                                <span className={`${fontClass} text-sm text-purple-300 font-semibold`}>
                                                    {t('Training Active')}
                                                </span>
                                            </div>
                                            <span className={`${fontClass} text-sm text-purple-400`}>
                                                {t('Accuracy')}: {project.aiTrainingStatus.accuracy}%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <UsersIcon className="w-4 h-4 text-gray-400" />
                                            <span className={`${fontClass} text-xs text-gray-400`}>{t('Team')}</span>
                                        </div>
                                        <p className={`${fontClass} text-lg font-bold text-gray-100`}>
                                            {project.metrics.contributors}
                                        </p>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CodeIcon className="w-4 h-4 text-gray-400" />
                                            <span className={`${fontClass} text-xs text-gray-400`}>{t('Commits')}</span>
                                        </div>
                                        <p className={`${fontClass} text-lg font-bold text-gray-100`}>
                                            {project.metrics.commits}
                                        </p>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CoinIcon className="w-4 h-4 text-yellow-400" />
                                            <span className={`${fontClass} text-xs text-gray-400`}>{t('Rewards')}</span>
                                        </div>
                                        <p className={`${fontClass} text-lg font-bold text-yellow-400`}>
                                            {project.rewards.total}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className={`${fontClass} px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium border border-blue-800/50`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                    {project.deadline && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <ClockIcon className="w-4 h-4" />
                                            <span className={fontClass}>{project.deadline}</span>
                                        </div>
                                    )}
                                    <button className={`${fontClass} text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors`}>
                                        {t('View Details')} →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                                <h2 className={`${fontClass} text-2xl font-bold text-gray-100`}>
                                    {t('Create New Project')}
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {createError && (
                                    <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                                        {createError}
                                    </div>
                                )}

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Project Title')}
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Enter project title..."
                                    />
                                </div>

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Description')}
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        rows={4}
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Describe your project..."
                                    />
                                </div>

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Category')}
                                    </label>
                                    <select
                                        value={newProject.category}
                                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as Project['category'] })}
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="ai-model">{t('AI Models')}</option>
                                        <option value="web-app">{t('Web Apps')}</option>
                                        <option value="mobile-app">{t('Mobile Apps')}</option>
                                        <option value="research">{t('Research')}</option>
                                        <option value="automation">Automation</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Deadline')} (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={newProject.deadline}
                                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Reward Budget')} (ZemenAI Coins)
                                    </label>
                                    <input
                                        type="number"
                                        value={newProject.rewardBudget}
                                        onChange={(e) => setNewProject({ ...newProject, rewardBudget: parseInt(e.target.value) || 0 })}
                                        min="0"
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`${fontClass} block text-sm font-medium text-gray-300 mb-2`}>
                                        {t('Tags (comma separated)')}
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                        className={`${fontClass} w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="AI, Development, Research..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-700 flex gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className={`${fontClass} flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors`}
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    disabled={isCreating || !newProject.title.trim()}
                                    className={`${fontClass} flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all`}
                                >
                                    {isCreating ? t('Creating...') : t('Create Project')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;