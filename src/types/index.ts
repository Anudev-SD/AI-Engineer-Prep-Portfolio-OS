export type TaskCategory = 
  | 'paper' 
  | 'project' 
  | 'leetcode' 
  | 'system_design' 
  | 'resume_github' 
  | 'interview_prep';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  estimatedHours?: number;
  notes?: string;
  resourceLink?: string;
  createdAt: string;
  completedAt?: string;
}

export type ProjectStatus = 'concept' | 'in_progress' | 'benchmarking' | 'completed' | 'published';
export type ProjectCategory = 
  | 'rag_agents' 
  | 'llm_fine_tuning' 
  | 'inference_serving' 
  | 'multimodal' 
  | 'ai_agents' 
  | 'core_ml';

export interface Deliverable {
  id: string;
  text: string;
  completed: boolean;
}

export interface EvalMetric {
  name: string;
  value: string;
  baseline?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  category: ProjectCategory;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  problemStatement: string;
  architectureNotes: string;
  starTalkingPoints: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  deliverables: Deliverable[];
  evalMetrics: EvalMetric[];
  updatedAt: string;
}

export type QuestionCategory = 
  | 'llm_internals' 
  | 'system_design' 
  | 'ml_fundamentals' 
  | 'mlops_eval' 
  | 'coding_pytorch' 
  | 'behavioral';

export type DifficultyLevel = 'Junior' | 'Mid' | 'Senior/Staff';
export type MasteryLevel = 'unstudied' | 'needs_practice' | 'familiar' | 'mastered';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  summary: string;
  detailedAnswer: string;
  keyTakeaways: string[];
  commonPitfalls: string[];
  mastery: MasteryLevel;
  lastReviewedAt?: string;
  reviewCount: number;
  userNotes?: string;
  isBookmarked: boolean;
}

export interface SkillItem {
  id: string;
  trackId: string;
  name: string;
  description: string;
  level: number; // 1 to 5
  targetLevel: number;
  coreConcepts: string[];
}

export interface SkillTrack {
  id: string;
  title: string;
  description: string;
  items: SkillItem[];
}

export interface StudySession {
  id: string;
  date: string;
  minutes: number;
  activity: string;
  notes?: string;
}

export interface MockInterviewLog {
  id: string;
  questionId: string;
  questionTitle: string;
  category: QuestionCategory;
  durationSeconds: number;
  userAnswerNotes: string;
  selfRating: number; // 1 to 5
  timestamp: string;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'portfolio' | 'interview' | 'skills';
