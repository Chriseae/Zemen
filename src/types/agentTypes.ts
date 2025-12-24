// types/agentTypes.ts

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'needs_input';
export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type MilestoneStatus = 'upcoming' | 'current' | 'completed' | 'delayed';

export interface AgentTask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    order: number;
    estimatedDuration: string; // e.g., "2 days", "3 hours"
    actualDuration?: string;
    dependencies?: string[]; // task IDs that must complete first
    output?: string; // Result/deliverable from this task
    needsUserInput?: boolean;
    userInputPrompt?: string;
    startedAt?: string;
    completedAt?: string;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    description: string;
    status: MilestoneStatus;
    targetDate: string;
    completedDate?: string;
    tasks: string[]; // task IDs in this milestone
    progress: number; // 0-100
}

export interface AgentProject {
    id: string;
    title: string;
    northStar: string; // User's main goal
    description: string;
    status: ProjectStatus;

    // Timeline
    createdAt: string;
    startDate: string;
    targetEndDate: string;
    actualEndDate?: string;
    estimatedDuration: string;

    // Progress tracking
    overallProgress: number; // 0-100
    currentPhase: string;
    currentMilestone?: string;

    // Files
    inputFiles: ProjectFile[];
    outputFiles: ProjectFile[];

    // Agent execution
    tasks: AgentTask[];
    milestones: ProjectMilestone[];
    executionPlan: string; // Agent's breakdown explanation

    // Interaction
    agentMessages: AgentMessage[];
    lastActivity: string;
    pausedReason?: string;

    // Settings
    autoExecute: boolean; // For future: true = runs automatically
    notifyOnMilestones: boolean;
    language: 'en' | 'am';
}

export interface ProjectFile {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    url?: string;
    data?: string; // base64 for client-side
}

export interface AgentMessage {
    id: string;
    type: 'status_update' | 'milestone_reached' | 'needs_input' | 'error' | 'completion';
    message: string;
    timestamp: string;
    data?: any; // Additional context
}

// Use case templates for Ethiopian context
export interface ProjectTemplate {
    id: string;
    title: string;
    titleAm: string;
    description: string;
    descriptionAm: string;
    category: 'translation' | 'business' | 'academic' | 'legal' | 'content' | 'other';
    estimatedDuration: string;
    icon: string;
    exampleGoal: string;
    exampleGoalAm: string;
    suggestedMilestones: string[];
}

// Agent response structure for task planning
export interface AgentPlanResponse {
    executionPlan: string;
    estimatedDuration: string;
    tasks: Omit<AgentTask, 'id'>[];
    milestones: Omit<ProjectMilestone, 'id'>[];
    recommendations: string[];
}