import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    tasks, 
    toggleTaskStatus, 
    projects, 
    questions, 
    skillTracks, 
    studySessions, 
    logStudySession,
    setActiveTab,
    timerRunning,
    timerSeconds,
    timerMode,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerPreset
  } = useApp();

  const [manualMinutes, setManualMinutes] = useState('30');
  const [manualActivity, setManualActivity] = useState('Paper Review');
  const [manualNotes, setManualNotes] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  // Compute metrics
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'todo');
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'done');
  
  const masteredQuestions = questions.filter((q) => q.mastery === 'mastered').length;
  const familiarQuestions = questions.filter((q) => q.mastery === 'familiar').length;
  const totalQuestions = questions.length;
  
  // Total skill score
  let totalSkillPoints = 0;
  let maxSkillPoints = 0;
  skillTracks.forEach((t) => {
    t.items.forEach((item) => {
      totalSkillPoints += item.level;
      maxSkillPoints += 5;
    });
  });
  const skillPercent = maxSkillPoints > 0 ? Math.round((totalSkillPoints / maxSkillPoints) * 100) : 0;

  // Interview Readiness Score (composite: 40% skills + 40% question mastery + 20% portfolio deliverables)
  const questionScore = totalQuestions > 0 ? Math.round(((masteredQuestions * 1.0 + familiarQuestions * 0.5) / totalQuestions) * 100) : 0;
  const totalDeliverables = projects.flatMap((p) => p.deliverables);
  const completedDeliverables = totalDeliverables.filter((d) => d.completed).length;
  const portfolioScore = totalDeliverables.length > 0 ? Math.round((completedDeliverables / totalDeliverables.length) * 100) : 0;
  const readinessScore = Math.round(skillPercent * 0.4 + questionScore * 0.4 + portfolioScore * 0.2);

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.minutes, 0);

  // Formatted timer string
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(manualMinutes, 10);
    if (mins > 0) {
      logStudySession(mins, manualActivity, manualNotes.trim() || undefined);
      setManualNotes('');
      setShowLogModal(false);
    }
  };

  // Featured Daily Drill Question
  const drillQuestion = questions.find((q) => q.mastery === 'needs_practice' || q.mastery === 'unstudied') || questions[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Focus Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Mission & Status */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">AI Engineering Career Command</div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Daily Practice & Preparation OS
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Consistently sharpening core Transformer math, expanding your open-source GitHub portfolio, and mastering interview architecture drills.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800">
            <div>
              <div className="text-xs text-slate-500">Interview Readiness</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                {readinessScore}%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Skills + QA + Portfolio</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Study Time Logged</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                {totalStudyMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{studySessions.length} total sessions</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Questions Mastered</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                {masteredQuestions} <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{familiarQuestions} in progress</div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Work Focus Timer */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Deep Work Focus Timer</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setTimerPreset('pomodoro')}
                className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  timerMode === 'pomodoro' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                25m Drill
              </button>
              <button
                onClick={() => setTimerPreset('deep_sprint')}
                className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  timerMode === 'deep_sprint' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                50m Sprint
              </button>
              <button
                onClick={() => setTimerPreset('short_break')}
                className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  timerMode === 'short_break' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5m Rest
              </button>
            </div>
          </div>

          <div className="text-center py-4 my-auto">
            <div className="text-5xl font-bold tracking-tight text-white font-mono tabular-nums">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {timerRunning ? 'Timer active · Stay focused' : 'Paused · Ready to sprint'}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {timerRunning ? (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus</span>
              </button>
            )}

            <button
              onClick={resetTimer}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Log Manual Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Tasks + Featured Drill Question */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Tasks & Next Milestones */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">High Priority Action Items</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {highPriorityTasks.length} urgent tasks requiring immediate attention
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {inProgressTasks.slice(0, 5).map((task) => {
              const isDone = task.status === 'done';
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-lg transition-colors group"
                >
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    aria-label={`Mark task ${task.title} as ${isDone ? 'incomplete' : 'complete'}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="capitalize">{task.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className={task.priority === 'high' ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                        {task.priority.toUpperCase()} Priority
                      </span>
                      {task.dueDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">Due {task.dueDate}</span>
                        </>
                      )}
                      {task.estimatedHours && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{task.estimatedHours}h est</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {inProgressTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                All prioritized tasks are marked completed! Ready to add new milestones.
              </div>
            )}
          </div>
        </div>

        {/* Featured Daily Drill Question */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">Featured Technical Drill</span>
              <span className="text-xs font-mono text-emerald-400">
                {drillQuestion?.difficulty} Level
              </span>
            </div>

            <h3 className="text-base font-semibold text-white leading-snug">
              {drillQuestion?.question}
            </h3>

            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              {drillQuestion?.summary}
            </p>

            <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg">
              <div className="text-xs font-semibold text-slate-300 mb-1.5">Key Focus Points:</div>
              <ul className="space-y-1">
                {drillQuestion?.keyTakeaways.slice(0, 2).map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="text-emerald-400 shrink-0">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 capitalize">
              Track: {drillQuestion?.category.replace('_', ' ')}
            </span>
            <button
              onClick={() => setActiveTab('interview')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Mock Drill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Projects Snapshot & Recent Study Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GitHub Portfolio Highlights */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">GitHub Portfolio Projects</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Practical architectures demonstrating production AI engineering competency
              </p>
            </div>
            <button
              onClick={() => setActiveTab('portfolio')}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => {
              const completedDelivs = proj.deliverables.filter((d) => d.completed).length;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveTab('portfolio')}
                  className="p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {proj.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono capitalize">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {proj.oneLiner}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/50 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>Stack:</span>
                      <span>{proj.techStack.slice(0, 4).join(', ')}</span>
                    </div>
                    <div className="font-mono tabular-nums text-slate-400">
                      {completedDelivs}/{proj.deliverables.length} Deliverables
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Study Activity Log */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Study & Practice Log</h2>
              <p className="text-xs text-slate-400 mt-0.5">Recent deep work & drill logs</p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Entry</span>
            </button>
          </div>

          <div className="space-y-2">
            {studySessions.slice(0, 4).map((session) => (
              <div
                key={session.id}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-slate-200">{session.activity}</div>
                  {session.notes && (
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{session.notes}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">{session.date}</div>
                </div>
                <div className="text-xs font-mono tabular-nums text-emerald-400 font-medium shrink-0 ml-3">
                  +{session.minutes}m
                </div>
              </div>
            ))}

            {studySessions.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No sessions logged yet today. Use the focus timer to begin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Time Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Log Study or Practice Session</h3>
            
            <form onSubmit={handleManualLog} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Activity Type</label>
                <select
                  value={manualActivity}
                  onChange={(e) => setManualActivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="Paper Review">Paper Reading & Math Theory</option>
                  <option value="Portfolio Coding">Portfolio Project Coding</option>
                  <option value="Interview Flashcards">Interview Flashcards & Drills</option>
                  <option value="Mock Practice">Mock Architecture Simulation</option>
                  <option value="LeetCode & ML Code">LeetCode & PyTorch Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Key Takeaway (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mastered RoPE complex rotation formulas..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
