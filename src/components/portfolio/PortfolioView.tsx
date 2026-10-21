import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioProject, ProjectCategory, ProjectStatus } from '../../types';
import { 
  Plus, 
  Github, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Layers, 
  X,
  FileText
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, toggleDeliverable } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [category, setCategory] = useState<ProjectCategory>('rag_agents');
  const [techStackStr, setTechStackStr] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [architectureNotes, setArchitectureNotes] = useState('');
  const [situation, setSituation] = useState('');
  const [taskText, setTaskText] = useState('');
  const [actionText, setActionText] = useState('');
  const [resultText, setResultText] = useState('');
  const [deliverablesStr, setDeliverablesStr] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    return selectedCategory === 'all' || p.category === selectedCategory;
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setOneLiner('');
    setStatus('concept');
    setCategory('rag_agents');
    setTechStackStr('Python, PyTorch, FastAPI, Docker');
    setGithubUrl('https://github.com/your-username/project-repo');
    setDemoUrl('');
    setProblemStatement('');
    setArchitectureNotes('');
    setSituation('');
    setTaskText('');
    setActionText('');
    setResultText('');
    setDeliverablesStr('Benchmark baseline vs tuned model\nImplement Docker Compose container\nWrite technical README with architecture diagram');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: PortfolioProject) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setOneLiner(proj.oneLiner);
    setStatus(proj.status);
    setCategory(proj.category);
    setTechStackStr(proj.techStack.join(', '));
    setGithubUrl(proj.githubUrl);
    setDemoUrl(proj.demoUrl || '');
    setProblemStatement(proj.problemStatement);
    setArchitectureNotes(proj.architectureNotes);
    setSituation(proj.starTalkingPoints.situation);
    setTaskText(proj.starTalkingPoints.task);
    setActionText(proj.starTalkingPoints.action);
    setResultText(proj.starTalkingPoints.result);
    setDeliverablesStr(proj.deliverables.map((d) => d.text).join('\n'));
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTechStack = techStackStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedDeliverables = deliverablesStr
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        // preserve completed state if editing
        const existing = editingProject?.deliverables[idx];
        return {
          id: existing ? existing.id : `deliv-${Date.now()}-${idx}`,
          text: line,
          completed: existing ? existing.completed : false,
        };
      });

    const projectPayload = {
      title: title.trim(),
      oneLiner: oneLiner.trim(),
      status,
      category,
      techStack: parsedTechStack.length > 0 ? parsedTechStack : ['Python'],
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim() || undefined,
      problemStatement: problemStatement.trim(),
      architectureNotes: architectureNotes.trim(),
      starTalkingPoints: {
        situation: situation.trim(),
        task: taskText.trim(),
        action: actionText.trim(),
        result: resultText.trim(),
      },
      deliverables: parsedDeliverables.length > 0 ? parsedDeliverables : [{ id: 'd1', text: 'Initial repo setup', completed: false }],
      evalMetrics: editingProject ? editingProject.evalMetrics : [
        { name: 'Throughput / Latency', value: '380ms', baseline: '850ms' }
      ],
    };

    if (editingProject) {
      updateProject(editingProject.id, projectPayload);
    } else {
      addProject(projectPayload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this portfolio project?')) {
      deleteProject(id);
      if (activeProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length > 0) setActiveProjectId(remaining[0].id);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">GitHub Portfolio Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Architect, benchmark, and articulate production-grade AI systems with clear STAR interview talking points.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Domains ({projects.length})
        </button>
        <button
          onClick={() => setSelectedCategory('rag_agents')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'rag_agents'
              ? 'bg-slate-800 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          RAG & Knowledge Retrieval
        </button>
        <button
          onClick={() => setSelectedCategory('inference_serving')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'inference_serving'
              ? 'bg-slate-800 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Inference & Serving (vLLM)
        </button>
        <button
          onClick={() => setSelectedCategory('llm_fine_tuning')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'llm_fine_tuning'
              ? 'bg-slate-800 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fine-Tuning & PEFT (QLoRA)
        </button>
        <button
          onClick={() => setSelectedCategory('ai_agents')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'ai_agents'
              ? 'bg-slate-800 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Autonomous Agents & Streaming
        </button>
      </div>

      {/* Two-Column Master / Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProjects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            const completedDelivs = proj.deliverables.filter((d) => d.completed).length;

            return (
              <div
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/80 shadow-md'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white leading-snug">
                    {proj.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 capitalize shrink-0">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {proj.oneLiner}
                </p>

                {/* Tech Stack tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs bg-slate-950 text-slate-300 border border-slate-800 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Bottom stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2.5 border-t border-slate-800/80">
                  <span className="capitalize">{proj.category.replace('_', ' ')}</span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {completedDelivs}/{proj.deliverables.length} Deliverables
                  </span>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No projects found in this category. Click New Project to create one.
            </div>
          )}
        </div>

        {/* Right Column: Full Project Detail, Architecture & STAR Interview Defense */}
        {activeProject ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400 mb-1 capitalize">
                  {activeProject.category.replace('_', ' ')} · Status: {activeProject.status.replace('_', ' ')}
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeProject.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeProject.oneLiner}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(activeProject)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Edit project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(activeProject.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Links and Tech Stack */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="font-mono">Repository</span>
                </a>
                {activeProject.demoUrl && (
                  <a
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo / Swagger</span>
                  </a>
                )}
              </div>

              <div className="text-xs text-slate-400">
                <span className="text-slate-500 mr-1.5">Stack:</span>
                <span className="font-mono">{activeProject.techStack.join(' · ')}</span>
              </div>
            </div>

            {/* Problem Statement & Architecture */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Problem Statement & Engineering Motivation</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  {activeProject.problemStatement}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Architecture & Pipeline Highlights</span>
                </h3>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {activeProject.architectureNotes}
                </pre>
              </div>
            </div>

            {/* STAR Story Interview Defense Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>STAR Interview Defense (Resume Bullets & Talking Points)</span>
                </h3>
                <span className="text-xs text-slate-500">Memorize for hiring manager rounds</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Situation</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.starTalkingPoints.situation}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Task</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.starTalkingPoints.task}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Action (Technical Strategy)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.starTalkingPoints.action}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-emerald-400">Result (Quantified Outcome)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.starTalkingPoints.result}
                  </p>
                </div>
              </div>
            </div>

            {/* Benchmarking Metrics */}
            {activeProject.evalMetrics && activeProject.evalMetrics.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Evaluation Benchmarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeProject.evalMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-center"
                    >
                      <div className="text-xs text-slate-400">{metric.name}</div>
                      <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                        {metric.value}
                      </div>
                      {metric.baseline && (
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          vs baseline {metric.baseline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables Checklist */}
            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                GitHub Repository Deliverables
              </h3>
              <div className="space-y-2">
                {activeProject.deliverables.map((deliv) => (
                  <div
                    key={deliv.id}
                    onClick={() => toggleDeliverable(activeProject.id, deliv.id)}
                    className="flex items-center gap-2.5 p-2 bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-lg cursor-pointer transition-colors"
                  >
                    {deliv.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        deliv.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {deliv.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
            Select a project to view its architecture notes and STAR defense.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. High-Throughput Serving Engine with PagedAttention"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">One-Liner Hook / Elevator Pitch</label>
                <input
                  type="text"
                  placeholder="e.g. Production inference gateway with continuous batching..."
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="rag_agents">RAG & Knowledge Retrieval</option>
                    <option value="inference_serving">Inference & Serving (vLLM/Triton)</option>
                    <option value="llm_fine_tuning">Fine-Tuning & PEFT (QLoRA)</option>
                    <option value="ai_agents">Autonomous Agents & Tool Calling</option>
                    <option value="multimodal">Multimodal & Vision-Language</option>
                    <option value="core_ml">Core ML & Optimization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="concept">Concept / Architecture Design</option>
                    <option value="in_progress">In Progress (Active Coding)</option>
                    <option value="benchmarking">Benchmarking & Evaluation</option>
                    <option value="completed">Completed & Documented</option>
                    <option value="published">Published on GitHub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="PyTorch, vLLM, FastAPI, Docker, Qdrant"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Live Demo / Swagger URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Problem Statement & Motivation</label>
                <textarea
                  rows={2}
                  placeholder="Explain why naive solutions fail and what real-world problem this tackles..."
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Architecture Notes & Pipeline</label>
                <textarea
                  rows={3}
                  placeholder="1. Ingestion -> 2. Hybrid search -> 3. Cross-encoder -> 4. Guardrails..."
                  value={architectureNotes}
                  onChange={(e) => setArchitectureNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              {/* STAR Inputs */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="text-xs font-semibold text-slate-300">STAR Interview Bullets</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Situation</label>
                    <input
                      type="text"
                      placeholder="Context & challenge..."
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Task</label>
                    <input
                      type="text"
                      placeholder="Goal & strict constraints..."
                      value={taskText}
                      onChange={(e) => setTaskText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Action (What you engineered)</label>
                    <input
                      type="text"
                      placeholder="Architecture, algorithms, optimizations..."
                      value={actionText}
                      onChange={(e) => setActionText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-emerald-400 mb-1">Result (Metrics & impact)</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.8x throughput, 65% latency reduction..."
                      value={resultText}
                      onChange={(e) => setResultText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deliverables Checklist (one item per line)</label>
                <textarea
                  rows={3}
                  placeholder="Benchmark baseline vs tuned model&#10;Add Dockerfile&#10;Write comprehensive README"
                  value={deliverablesStr}
                  onChange={(e) => setDeliverablesStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
