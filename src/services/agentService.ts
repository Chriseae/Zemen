// services/agentService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    AgentProject,
    AgentTask,
    ProjectMilestone,
    AgentPlanResponse,
    AgentMessage
} from '../types/agentTypes';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class AgentService {
    private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    /**
     * Phase 1: Agent analyzes user's goal and creates execution plan
     */
    async createExecutionPlan(
        northStar: string,
        description: string,
        targetDuration: string,
        language: 'en' | 'am'
    ): Promise<AgentPlanResponse> {
        const prompt = language === 'am' ? this.getAmharicPlanningPrompt(northStar, description, targetDuration)
            : this.getEnglishPlanningPrompt(northStar, description, targetDuration);

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();

            // Parse AI response into structured plan
            return this.parseExecutionPlan(response);
        } catch (error) {
            console.error('Agent planning failed:', error);
            throw new Error('Failed to create execution plan');
        }
    }

    /**
     * Phase 2: Execute a specific task
     */
    async executeTask(
        task: AgentTask,
        project: AgentProject,
        userInput?: string
    ): Promise<{ output: string; nextSteps?: string }> {
        const context = this.buildTaskContext(task, project);

        const prompt = `
You are an autonomous AI agent executing a task for a project.

PROJECT CONTEXT:
${context}

CURRENT TASK:
Title: ${task.title}
Description: ${task.description}
${userInput ? `User Input: ${userInput}` : ''}

Execute this task step-by-step. Provide detailed output of what you accomplished.
If you need additional information from the user, clearly state what you need.

Output format:
1. What you did
2. Results/deliverables
3. Any issues encountered
4. Next recommended steps (if any)
`;

        try {
            const result = await this.model.generateContent(prompt);
            const output = result.response.text();

            return { output };
        } catch (error) {
            console.error('Task execution failed:', error);
            throw new Error('Failed to execute task');
        }
    }

    /**
     * Generate progress report for a milestone
     */
    async generateProgressReport(
        project: AgentProject,
        milestone: ProjectMilestone
    ): Promise<string> {
        const completedTasks = project.tasks.filter(
            t => milestone.tasks.includes(t.id) && t.status === 'completed'
        );

        const prompt = `
Generate a concise progress report for this project milestone.

PROJECT: ${project.title}
MILESTONE: ${milestone.title}
COMPLETED TASKS: ${completedTasks.length} of ${milestone.tasks.length}

Tasks completed:
${completedTasks.map(t => `- ${t.title}: ${t.output || 'Done'}`).join('\n')}

Create a brief, professional progress report summarizing achievements and next steps.
`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Smart file processing (for uploaded documents)
     */
    async processFile(
        file: { name: string; type: string; data: string },
        purpose: string
    ): Promise<string> {
        // For text files, extract and analyze content
        if (file.type.includes('text') || file.type.includes('pdf')) {
            const prompt = `
Analyze this file and extract relevant information for: ${purpose}

File: ${file.name}
Content: ${file.data.slice(0, 5000)} ${file.data.length > 5000 ? '...(truncated)' : ''}

Provide a structured summary of the file's content.
`;

            const result = await this.model.generateContent(prompt);
            return result.response.text();
        }

        return `File ${file.name} uploaded successfully. Ready for processing.`;
    }

    // ========== PRIVATE HELPER METHODS ==========

    private getEnglishPlanningPrompt(northStar: string, description: string, duration: string): string {
        return `
You are an AI project planning agent. Break down this goal into executable tasks and milestones.

USER'S GOAL (North Star): ${northStar}
DESCRIPTION: ${description}
TARGET DURATION: ${duration}

Create a detailed execution plan with:
1. Overall strategy and approach
2. Major milestones (3-5 key checkpoints)
3. Specific tasks for each milestone (be detailed and actionable)
4. Estimated time for each task
5. Task dependencies
6. Potential blockers and how to handle them

Format your response as JSON with this structure:
{
  "executionPlan": "Brief overview of strategy",
  "estimatedDuration": "Realistic time estimate",
  "milestones": [
    {
      "title": "Milestone name",
      "description": "What this achieves",
      "targetDate": "Day X or Week X",
      "tasks": ["task_id_1", "task_id_2"]
    }
  ],
  "tasks": [
    {
      "title": "Task name",
      "description": "Detailed task description",
      "status": "pending",
      "order": 1,
      "estimatedDuration": "X hours/days",
      "dependencies": [],
      "needsUserInput": false
    }
  ],
  "recommendations": ["Suggestion 1", "Suggestion 2"]
}
`;
    }

    private getAmharicPlanningPrompt(northStar: string, description: string, duration: string): string {
        return `
አንተ የAI ፕሮጀክት እቅድ ወኪል ነህ። ይህንን ግብ ወደ ተግባራዊ ተግባራት እና ምዕራፎች ከፋፍለው።

የተጠቃሚ ግብ: ${northStar}
መግለጫ: ${description}
የታለመው ጊዜ: ${duration}

ዝርዝር የአፈጻጸም ዕቅድ ይፍጠሩ፡
1. አጠቃላይ ስልት እና አቀራረብ
2. ዋና ምዕራፎች (3-5 ቁልፍ ነጥቦች)
3. ለእያንዳንዱ ምዕራፍ ልዩ ተግባራት
4. ለእያንዳንዱ ተግባር የተገመተ ጊዜ
5. የተግባር ጥገኞች
6. ሊሆኑ የሚችሉ እንቅፋቶች እና እንዴት እንደሚቋቋሙ

መልስዎን በዚህ JSON መዋቅር ያቅርቡ፡ (in English structure but with Amharic descriptions)
`;
    }

    private parseExecutionPlan(aiResponse: string): AgentPlanResponse {
        try {
            // Remove markdown code blocks if present
            let cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const parsed = JSON.parse(cleanResponse);

            // Generate IDs for tasks and milestones
            const tasks = parsed.tasks.map((task: any, idx: number) => ({
                ...task,
                id: `task_${Date.now()}_${idx}`,
                status: 'pending'
            }));

            const milestones = parsed.milestones.map((milestone: any, idx: number) => ({
                ...milestone,
                id: `milestone_${Date.now()}_${idx}`,
                status: 'upcoming',
                progress: 0,
                tasks: milestone.tasks || []
            }));

            return {
                executionPlan: parsed.executionPlan,
                estimatedDuration: parsed.estimatedDuration,
                tasks,
                milestones,
                recommendations: parsed.recommendations || []
            };
        } catch (error) {
            console.error('Failed to parse AI plan:', error);

            // Fallback: create a simple plan
            return this.createFallbackPlan(aiResponse);
        }
    }

    private createFallbackPlan(rawResponse: string): AgentPlanResponse {
        return {
            executionPlan: rawResponse.slice(0, 500),
            estimatedDuration: "To be determined",
            tasks: [
                {
                    title: "Planning Phase",
                    description: "Define detailed project requirements",
                    status: 'pending',
                    order: 1,
                    estimatedDuration: "1 day"
                },
                {
                    title: "Execution Phase",
                    description: "Execute main project tasks",
                    status: 'pending',
                    order: 2,
                    estimatedDuration: "3 days"
                },
                {
                    title: "Review Phase",
                    description: "Quality check and refinement",
                    status: 'pending',
                    order: 3,
                    estimatedDuration: "1 day"
                }
            ],
            milestones: [
                {
                    title: "Planning Complete",
                    description: "Initial planning finished",
                    targetDate: "Day 1",
                    tasks: [],
                    status: 'upcoming',
                    progress: 0
                }
            ],
            recommendations: ["Review AI-generated plan", "Adjust timeline as needed"]
        };
    }

    private buildTaskContext(task: AgentTask, project: AgentProject): string {
        const completedTasks = project.tasks
            .filter(t => t.status === 'completed')
            .map(t => `- ${t.title}: ${t.output || 'Completed'}`)
            .join('\n');

        return `
Project: ${project.title}
Goal: ${project.northStar}
Current Phase: ${project.currentPhase}
Progress: ${project.overallProgress}%

Completed Tasks:
${completedTasks || 'None yet'}

Task Dependencies: ${task.dependencies?.join(', ') || 'None'}
`;
    }
}

export const agentService = new AgentService();