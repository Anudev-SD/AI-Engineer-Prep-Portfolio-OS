import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  PortfolioProject, 
  InterviewQuestion, 
  SkillTrack, 
  StudySession, 
  MockInterviewLog, 
  ActiveTab,
  MasteryLevel 
} from '../types';
import { 
  INITIAL_TASKS, 
  INITIAL_PROJECTS, 
  INITIAL_QUESTIONS, 
  INITIAL_SKILL_TRACKS, 
  INITIAL_STUDY_SESSIONS 
} from '../data/defaultData';

const STORAGE_KEY = 'ai_engineer_os_v1';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Projects
  projects: PortfolioProject[];
  addProject: (project: Omit<PortfolioProject, 'id' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => void;
  deleteProject: (id: string) => void;
  toggleDeliverable: (projectId: string, deliverableId: string) => void;
  
  // Interview Questions
  questions: InterviewQuestion[];
  updateQuestionMastery: (id: string, mastery: MasteryLevel) => void;
  toggleQuestionBookmark: (id: string) => void;
  updateQuestionNotes: (id: string, notes: string) => void;
  addQuestion: (question: Omit<InterviewQuestion, 'id' | 'reviewCount' | 'mastery' | 'isBookmarked'>) => void;
  
  // Mock Interviews
  mockLogs: MockInterviewLog[];
  addMockLog: (log: Omit<MockInterviewLog, 'id' | 'timestamp'>) => void;
  
  // Skills
  skillTracks: SkillTrack[];
  updateSkillLevel: (trackId: string, skillId: string, level: number) => void;
  
  // Study Sessions
  studySessions: StudySession[];
  logStudySession: (minutes: number, activity: string, notes?: string) => void;
  
  // Data management
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetToDefault: () => void;
  
  // Focus Timer state
  timerRunning: boolean;
  timerSeconds: number;
  timerMode: 'pomodoro' | 'short_break' | 'deep_sprint';
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerPreset: (mode: 'pomodoro' | 'short_break' | 'deep_sprint') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Initialize from LocalStorage or defaultData
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_questions`);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [skillTracks, setSkillTracks] = useState<SkillTrack[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_skills`);
      return saved ? JSON.parse(saved) : INITIAL_SKILL_TRACKS;
    } catch {
      return INITIAL_SKILL_TRACKS;
    }
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_STUDY_SESSIONS;
    } catch {
      return INITIAL_STUDY_SESSIONS;
    }
  });

  const [mockLogs, setMockLogs] = useState<MockInterviewLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mocklogs`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Focus Timer State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'short_break' | 'deep_sprint'>('pomodoro');
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_questions`, JSON.stringify(questions));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_skills`, JSON.stringify(skillTracks));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [skillTracks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(studySessions));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [studySessions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_mocklogs`, JSON.stringify(mockLogs));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [mockLogs]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            // Auto log session
            const mins = timerMode === 'pomodoro' ? 25 : timerMode === 'deep_sprint' ? 50 : 5;
            logStudySession(mins, 'Deep Focus Session', `Completed ${timerMode.replace('_', ' ')}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds, timerMode]);

  // Timer controls
  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    const defaults = {
      pomodoro: 25 * 60,
      short_break: 5 * 60,
      deep_sprint: 50 * 60,
    };
    setTimerSeconds(defaults[timerMode]);
  };

  const setTimerPreset = (mode: 'pomodoro' | 'short_break' | 'deep_sprint') => {
    setTimerMode(mode);
    setTimerRunning(false);
    const defaults = {
      pomodoro: 25 * 60,
      short_break: 5 * 60,
      deep_sprint: 50 * 60,
    };
    setTimerSeconds(defaults[mode]);
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'done' && t.status !== 'done') {
            updated.completedAt = new Date().toISOString();
          } else if (updates.status && updates.status !== 'done') {
            updated.completedAt = undefined;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'done' ? 'todo' : 'done';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Project Actions
  const addProject = (projectData: Omit<PortfolioProject, 'id' | 'updatedAt'>) => {
    const newProj: PortfolioProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<PortfolioProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleDeliverable = (projectId: string, deliverableId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedDeliverables = p.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, completed: !d.completed } : d
          );
          return { ...p, deliverables: updatedDeliverables, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  // Interview Questions Actions
  const updateQuestionMastery = (id: string, mastery: MasteryLevel) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              mastery,
              reviewCount: q.reviewCount + 1,
              lastReviewedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const toggleQuestionBookmark = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isBookmarked: !q.isBookmarked } : q))
    );
  };

  const updateQuestionNotes = (id: string, notes: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userNotes: notes } : q))
    );
  };

  const addQuestion = (questionData: Omit<InterviewQuestion, 'id' | 'reviewCount' | 'mastery' | 'isBookmarked'>) => {
    const newQ: InterviewQuestion = {
      ...questionData,
      id: `q-${Date.now()}`,
      mastery: 'unstudied',
      reviewCount: 0,
      isBookmarked: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  // Mock Interview Actions
  const addMockLog = (logData: Omit<MockInterviewLog, 'id' | 'timestamp'>) => {
    const newLog: MockInterviewLog = {
      ...logData,
      id: `mock-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMockLogs((prev) => [newLog, ...prev]);
    // Also record study time
    const mins = Math.max(1, Math.round(logData.durationSeconds / 60));
    logStudySession(mins, 'Mock Practice', `Practiced: ${logData.questionTitle.slice(0, 40)}...`);
  };

  // Skill Matrix Actions
  const updateSkillLevel = (trackId: string, skillId: string, level: number) => {
    setSkillTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          return {
            ...t,
            items: t.items.map((item) =>
              item.id === skillId ? { ...item, level: Math.min(5, Math.max(1, level)) } : item
            ),
          };
        }
        return t;
      })
    );
  };

  // Study Sessions
  const logStudySession = (minutes: number, activity: string, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      date: today,
      minutes,
      activity,
      notes,
    };
    setStudySessions((prev) => [newSession, ...prev]);
  };

  // Backup & Import
  const exportDataJson = () => {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      projects,
      questions,
      skillTracks,
      studySessions,
      mockLogs,
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.questions)) setQuestions(data.questions);
      if (Array.isArray(data.skillTracks)) setSkillTracks(data.skillTracks);
      if (Array.isArray(data.studySessions)) setStudySessions(data.studySessions);
      if (Array.isArray(data.mockLogs)) setMockLogs(data.mockLogs);
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON', e);
      return false;
    }
  };

  const resetToDefault = () => {
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setQuestions(INITIAL_QUESTIONS);
    setSkillTracks(INITIAL_SKILL_TRACKS);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setMockLogs([]);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_questions`);
    localStorage.removeItem(`${STORAGE_KEY}_skills`);
    localStorage.removeItem(`${STORAGE_KEY}_sessions`);
    localStorage.removeItem(`${STORAGE_KEY}_mocklogs`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleDeliverable,
        questions,
        updateQuestionMastery,
        toggleQuestionBookmark,
        updateQuestionNotes,
        addQuestion,
        mockLogs,
        addMockLog,
        skillTracks,
        updateSkillLevel,
        studySessions,
        logStudySession,
        exportDataJson,
        importDataJson,
        resetToDefault,
        timerRunning,
        timerSeconds,
        timerMode,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerPreset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
