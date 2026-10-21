import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InterviewQuestion, QuestionCategory, DifficultyLevel, MasteryLevel } from '../../types';
import { 
  Search, 
  Bookmark, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  X,
  FileCode,
  Award
} from 'lucide-react';

export const InterviewPrepView: React.FC = () => {
  const { 
    questions, 
    updateQuestionMastery, 
    toggleQuestionBookmark, 
    updateQuestionNotes,
    addQuestion,
    mockLogs,
    addMockLog
  } = useApp();

  // Mode: 'bank' | 'flashcards' | 'simulator'
  const [prepMode, setPrepMode] = useState<'bank' | 'flashcards' | 'simulator'>('bank');

  // Filters for bank
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedMastery, setSelectedMastery] = useState<string>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(questions[0]?.id || null);

  // Flashcard mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock Simulator state
  const [simQuestionId, setSimQuestionId] = useState<string>(questions[0]?.id || '');
  const [simTimerSeconds, setSimTimerSeconds] = useState(10 * 60); // 10 minutes default
  const [simRunning, setSimRunning] = useState(false);
  const [simUserNotes, setSimUserNotes] = useState('');
  const [simSubmitted, setSimSubmitted] = useState(false);
  const [simScore, setSimScore] = useState<number>(4);

  // Add custom question modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<QuestionCategory>('llm_internals');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Mid');
  const [newSummary, setNewSummary] = useState('');
  const [newDetailedAnswer, setNewDetailedAnswer] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newPitfalls, setNewPitfalls] = useState('');

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.detailedAnswer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchMastery = selectedMastery === 'all' || q.mastery === selectedMastery;
      const matchBookmark = !bookmarkedOnly || q.isBookmarked;
      return matchSearch && matchCategory && matchDifficulty && matchMastery && matchBookmark;
    });
  }, [questions, searchQuery, selectedCategory, selectedDifficulty, selectedMastery, bookmarkedOnly]);

  // Simulator timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simRunning && simTimerSeconds > 0) {
      interval = setInterval(() => {
        setSimTimerSeconds((prev) => {
          if (prev <= 1) {
            setSimRunning(false);
            setSimSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simRunning, simTimerSeconds]);

  const activeSimQuestion = questions.find((q) => q.id === simQuestionId) || questions[0];

  const handleStartSim = (durationMins: number) => {
    setSimTimerSeconds(durationMins * 60);
    setSimRunning(true);
    setSimSubmitted(false);
    setSimUserNotes('');
  };

  const handleFinishSim = () => {
    setSimRunning(false);
    setSimSubmitted(true);
    if (activeSimQuestion) {
      const durationElapsed = 10 * 60 - simTimerSeconds;
      addMockLog({
        questionId: activeSimQuestion.id,
        questionTitle: activeSimQuestion.question,
        category: activeSimQuestion.category,
        durationSeconds: Math.max(15, durationElapsed),
        userAnswerNotes: simUserNotes,
        selfRating: simScore,
      });
    }
  };

  const handleSaveCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    addQuestion({
      question: newQuestion.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      summary: newSummary.trim() || newQuestion.trim(),
      detailedAnswer: newDetailedAnswer.trim(),
      keyTakeaways: newTakeaways.split('\n').map((s) => s.trim()).filter(Boolean),
      commonPitfalls: newPitfalls.split('\n').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
    setNewQuestion('');
    setNewSummary('');
    setNewDetailedAnswer('');
    setNewTakeaways('');
    setNewPitfalls('');
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Engineering Interview Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Master Transformer internals, RAG architecture, PEFT math, PyTorch coding, and behavioral STAR defense.
          </p>
        </div>

        {/* 3 Interactive Modes */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => { setPrepMode('bank'); setIsFlipped(false); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                prepMode === 'bank' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Question Bank ({questions.length})
            </button>
            <button
              onClick={() => { setPrepMode('flashcards'); setIsFlipped(false); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                prepMode === 'flashcards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Recall Flashcards
            </button>
            <button
              onClick={() => { setPrepMode('simulator'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                prepMode === 'simulator' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mock Interview Simulator
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* MODE 1: QUESTION BANK */}
      {prepMode === 'bank' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search questions, keywords (FlashAttention, LoRA, KV cache, RAG)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Disciplines</option>
                <option value="llm_internals">Transformer & LLM Internals</option>
                <option value="system_design">AI System Design & RAG</option>
                <option value="ml_fundamentals">Core ML Fundamentals</option>
                <option value="mlops_eval">MLOps, Serving & Evaluation</option>
                <option value="coding_pytorch">PyTorch Implementation</option>
                <option value="behavioral">Behavioral & Story Defense</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Difficulties</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior/Staff">Senior / Staff</option>
              </select>

              <select
                value={selectedMastery}
                onChange={(e) => setSelectedMastery(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Mastery Levels</option>
                <option value="unstudied">Unstudied</option>
                <option value="needs_practice">Needs Practice</option>
                <option value="familiar">Familiar</option>
                <option value="mastered">Mastered</option>
              </select>

              <button
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                  bookmarkedOnly
                    ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-current' : ''}`} />
                <span>Bookmarked</span>
              </button>
            </div>
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  {/* Collapsed Header Bar */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="capitalize">{q.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">{q.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{q.mastery.replace('_', ' ')}</span>
                        {q.reviewCount > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{q.reviewCount} reviews</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-white leading-snug hover:text-emerald-300 transition-colors">
                        {q.question}
                      </h3>

                      {!isExpanded && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {q.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleQuestionBookmark(q.id)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          q.isBookmarked
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={q.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                      >
                        <Bookmark className={`w-4 h-4 ${q.isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-md cursor-pointer"
                        aria-label={isExpanded ? 'Collapse question' : 'Expand question'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Solution & Rubric */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-5">
                      {/* Detailed Technical Answer */}
                      <div>
                        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Detailed Technical Answer & Architecture</span>
                        </div>
                        <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                          {q.detailedAnswer}
                        </pre>
                      </div>

                      {/* Key Takeaways & Common Pitfalls Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Core Talking Points for Interviews</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {q.keyTakeaways.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 shrink-0">·</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                          <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Red Flags & Pitfalls to Avoid</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {q.commonPitfalls.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-rose-400 shrink-0">·</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* User's Custom Scratchpad / Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Personal Retention Notes / Interview Mnemonics
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Add your personal notes, reminders, or specific equations..."
                          value={q.userNotes || ''}
                          onChange={(e) => updateQuestionNotes(q.id, e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-hidden"
                        />
                      </div>

                      {/* Mastery Rating Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                        <span className="text-xs text-slate-400">Self-Assessed Mastery Level:</span>
                        <div className="flex items-center gap-1.5">
                          {(['needs_practice', 'familiar', 'mastered'] as MasteryLevel[]).map((level) => {
                            const isCurrent = q.mastery === level;
                            return (
                              <button
                                key={level}
                                onClick={() => updateQuestionMastery(q.id, level)}
                                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors cursor-pointer ${
                                  isCurrent
                                    ? level === 'mastered'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                      : level === 'familiar'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                              >
                                {level.replace('_', ' ')}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No questions match your current filter parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: ACTIVE RECALL FLASHCARDS */}
      {prepMode === 'flashcards' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Card {flashcardIndex + 1} of {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex((prev) => Math.max(0, prev - 1));
                  setIsFlipped(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                disabled={flashcardIndex >= filteredQuestions.length - 1}
                onClick={() => {
                  setFlashcardIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
                  setIsFlipped(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredQuestions[flashcardIndex] ? (
            (() => {
              const cardQ = filteredQuestions[flashcardIndex];
              return (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[420px] flex flex-col justify-between shadow-xl">
                  {/* Card Front (Question) */}
                  {!isFlipped ? (
                    <div className="space-y-6 my-auto text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                        <span className="capitalize">{cardQ.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-400">{cardQ.difficulty}</span>
                      </div>

                      <h2 className="text-2xl font-bold text-white max-w-xl mx-auto leading-snug">
                        {cardQ.question}
                      </h2>

                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Pause and mentally structure your answer: Define components, equations, memory tradeoffs, and edge cases.
                      </p>

                      <div className="pt-4">
                        <button
                          onClick={() => setIsFlipped(true)}
                          className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                        >
                          Reveal Detailed Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Card Back (Answer & Rubric) */
                    <div className="space-y-5 overflow-y-auto max-h-[500px] pr-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="text-xs text-slate-400">{cardQ.question}</span>
                        <button
                          onClick={() => setIsFlipped(false)}
                          className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Flip Back
                        </button>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                          Technical Solution
                        </div>
                        <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                          {cardQ.detailedAnswer}
                        </pre>
                      </div>

                      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                        <div className="text-xs font-semibold text-slate-300">Must-Mention Talking Points:</div>
                        <ul className="space-y-1 text-xs text-slate-400">
                          {cardQ.keyTakeaways.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400">·</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Immediate Mastery Rating & Advance */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <span className="text-xs text-slate-400">How did you perform?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              updateQuestionMastery(cardQ.id, 'needs_practice');
                              if (flashcardIndex < filteredQuestions.length - 1) {
                                setFlashcardIndex((p) => p + 1);
                                setIsFlipped(false);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-lg hover:bg-amber-950/60 transition-colors cursor-pointer"
                          >
                            Needs Practice
                          </button>
                          <button
                            onClick={() => {
                              updateQuestionMastery(cardQ.id, 'familiar');
                              if (flashcardIndex < filteredQuestions.length - 1) {
                                setFlashcardIndex((p) => p + 1);
                                setIsFlipped(false);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-blue-300 bg-blue-950/40 border border-blue-800/50 rounded-lg hover:bg-blue-950/60 transition-colors cursor-pointer"
                          >
                            Familiar
                          </button>
                          <button
                            onClick={() => {
                              updateQuestionMastery(cardQ.id, 'mastered');
                              if (flashcardIndex < filteredQuestions.length - 1) {
                                setFlashcardIndex((p) => p + 1);
                                setIsFlipped(false);
                              }
                            }}
                            className="px-3 py-1.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-lg hover:bg-emerald-950/60 transition-colors cursor-pointer"
                          >
                            Mastered
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No flashcards match current criteria.
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MOCK INTERVIEW SIMULATOR */}
      {prepMode === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Simulator Controls & Prompt */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Live Mock Simulation</span>
              <div className="text-xl font-bold font-mono tabular-nums text-white">
                {formatTimer(simTimerSeconds)}
              </div>
            </div>

            {/* Select Prompt */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Select Interview Question</label>
              <select
                value={simQuestionId}
                onChange={(e) => {
                  setSimQuestionId(e.target.value);
                  setSimSubmitted(false);
                  setSimUserNotes('');
                  setSimRunning(false);
                  setSimTimerSeconds(10 * 60);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{q.difficulty}] {q.question.slice(0, 65)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize">{activeSimQuestion?.category.replace('_', ' ')}</span>
                <span className="font-mono text-emerald-400">{activeSimQuestion?.difficulty}</span>
              </div>
              <h3 className="text-base font-semibold text-white leading-snug">
                {activeSimQuestion?.question}
              </h3>
            </div>

            {/* Duration Buttons & Timer controls */}
            {!simRunning && !simSubmitted && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Preset Simulation Duration:</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartSim(5)}
                    className="flex-1 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    5 Min Blitz
                  </button>
                  <button
                    onClick={() => handleStartSim(10)}
                    className="flex-1 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                  >
                    10 Min Standard
                  </button>
                  <button
                    onClick={() => handleStartSim(15)}
                    className="flex-1 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    15 Min Deep Dive
                  </button>
                </div>
              </div>
            )}

            {simRunning && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setSimRunning(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 rounded-lg cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Timer</span>
                </button>
                <button
                  onClick={handleFinishSim}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Finish & Compare Rubric</span>
                </button>
              </div>
            )}

            {/* Candidate Answer Notepad */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Your Answer & Whiteboard Outline
              </label>
              <textarea
                rows={10}
                placeholder="Type your response structure here as if speaking or whiteboarding in an interview...&#10;1. First principles overview&#10;2. Key mathematical formulation / architecture&#10;3. Latency vs memory trade-offs&#10;4. Edge cases & production considerations"
                value={simUserNotes}
                onChange={(e) => setSimUserNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Right Column: Model Solution Rubric & History */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Evaluation Rubric & Benchmark Solution</span>
              {simSubmitted && (
                <span className="text-xs text-emerald-400 font-medium">Completed</span>
              )}
            </div>

            {simSubmitted ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-slate-300">Self-Score Your Response:</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => {
                          setSimScore(stars);
                          if (activeSimQuestion) {
                            addMockLog({
                              questionId: activeSimQuestion.id,
                              questionTitle: activeSimQuestion.question,
                              category: activeSimQuestion.category,
                              durationSeconds: 10 * 60 - simTimerSeconds,
                              userAnswerNotes: simUserNotes,
                              selfRating: stars,
                            });
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                          simScore === stars
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {stars} / 5 Stars
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Model Architectural Answer
                  </div>
                  <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                    {activeSimQuestion?.detailedAnswer}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400">Crucial Candidate Signals:</div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeSimQuestion?.keyTakeaways.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">·</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2">
                <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                <p>The technical rubric is concealed during your simulation.</p>
                <p className="text-slate-600">Start the timer and write your answer outline on the left, then click Finish to review.</p>
              </div>
            )}

            {/* Recent Mock Interview Logs */}
            {mockLogs.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Past Simulation Logs ({mockLogs.length})
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockLogs.slice(0, 3).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-slate-200 truncate">{log.questionTitle}</div>
                        <div className="text-slate-500 font-mono text-xs">
                          {Math.round(log.durationSeconds / 60)}m drill · Rating: {log.selfRating}/5
                        </div>
                      </div>
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Add Custom Interview Drill</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Question Prompt</label>
                <input
                  type="text"
                  placeholder="e.g. How does PagedAttention eliminate memory fragmentation?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="llm_internals">Transformer & LLM Internals</option>
                    <option value="system_design">AI System Design & RAG</option>
                    <option value="ml_fundamentals">Core ML Fundamentals</option>
                    <option value="mlops_eval">MLOps, Serving & Evaluation</option>
                    <option value="coding_pytorch">PyTorch Implementation</option>
                    <option value="behavioral">Behavioral & Story Defense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior/Staff">Senior / Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Summary (1-sentence overview)</label>
                <input
                  type="text"
                  placeholder="Concise core idea..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Complete Technical Solution</label>
                <textarea
                  rows={4}
                  placeholder="Detailed explanation, math, architectural diagram steps, code snippets..."
                  value={newDetailedAnswer}
                  onChange={(e) => setNewDetailedAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Takeaways (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="Point 1&#10;Point 2"
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Common Pitfalls (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="Pitfall 1&#10;Pitfall 2"
                  value={newPitfalls}
                  onChange={(e) => setNewPitfalls(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
