import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../../types';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Kanban,
  List as ListIcon,
  X
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modal / Drawer state for adding or editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('project');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [notes, setNotes] = useState('');
  const [resourceLink, setResourceLink] = useState('');

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setCategory('project');
    setPriority('medium');
    setStatus('todo');
    setDueDate('');
    setEstimatedHours('');
    setNotes('');
    setResourceLink('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate || '');
    setEstimatedHours(task.estimatedHours ? task.estimatedHours.toString() : '');
    setNotes(task.notes || '');
    setResourceLink(task.resourceLink || '');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      category,
      priority,
      status,
      dueDate: dueDate || undefined,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      notes: notes.trim() || undefined,
      resourceLink: resourceLink.trim() || undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }
    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchPriority = selectedPriority === 'all' || t.priority === selectedPriority;
      const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
      return matchSearch && matchCategory && matchPriority && matchStatus;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  const kanbanColumns: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'review', title: 'Under Review' },
    { status: 'done', title: 'Completed' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Engineering Tasks & Sprints</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize paper reviews, portfolio sprints, PyTorch algorithms, and interview milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks, notes, formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-slate-700"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="project">Portfolio Project</option>
            <option value="paper">Paper Reading & Math</option>
            <option value="interview_prep">Interview Prep Drill</option>
            <option value="leetcode">LeetCode / PyTorch Code</option>
            <option value="system_design">AI System Design</option>
            <option value="resume_github">Resume & GitHub Polish</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Status Filter (useful in List view) */}
          {viewMode === 'list' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="done">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{col.title}</span>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">({colTasks.length})</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-colors group space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-medium leading-snug ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            title="Edit task"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {task.notes && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      {/* Clean Unboxed Metadata */}
                      <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-800/60">
                        <span className="capitalize">{task.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className={task.priority === 'high' ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.estimatedHours && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{task.estimatedHours}h</span>
                          </>
                        )}
                        {task.dueDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{task.dueDate}</span>
                          </>
                        )}
                      </div>

                      {/* Column Move Triggers */}
                      <div className="flex items-center justify-between pt-1">
                        {task.resourceLink && (
                          <a
                            href={task.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Resource</span>
                          </a>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {col.status !== 'todo' && (
                            <button
                              onClick={() => {
                                const prevStatus: Record<TaskStatus, TaskStatus> = {
                                  done: 'review',
                                  review: 'in_progress',
                                  in_progress: 'todo',
                                  todo: 'todo',
                                };
                                updateTask(task.id, { status: prevStatus[col.status] });
                              }}
                              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer"
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          {col.status !== 'done' && (
                            <button
                              onClick={() => {
                                const nextStatus: Record<TaskStatus, TaskStatus> = {
                                  todo: 'in_progress',
                                  in_progress: 'review',
                                  review: 'done',
                                  done: 'done',
                                };
                                updateTask(task.id, { status: nextStatus[col.status] });
                              }}
                              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer"
                              title="Move right"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-12 text-center text-xs text-slate-600 border border-dashed border-slate-800/80 rounded-lg">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400 font-medium">
                  <th className="py-3 px-4 w-10">Done</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Estimate</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredTasks.map((task) => {
                  const isDone = task.status === 'done';
                  return (
                    <tr key={task.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </div>
                        {task.notes && (
                          <div className="text-slate-400 mt-0.5 line-clamp-1">{task.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 capitalize">
                        {task.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={task.priority === 'high' ? 'text-amber-400 font-medium' : 'text-slate-400'}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 capitalize text-xs cursor-pointer"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                        {task.estimatedHours ? `${task.estimatedHours}h` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                        {task.dueDate || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No matching tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingTask ? 'Edit Task' : 'Create New Preparation Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Implement rotary embeddings (RoPE) forward pass..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="project">Portfolio Project</option>
                    <option value="paper">Paper Reading & Math</option>
                    <option value="interview_prep">Interview Prep Drill</option>
                    <option value="leetcode">LeetCode / PyTorch Code</option>
                    <option value="system_design">AI System Design</option>
                    <option value="resume_github">Resume & GitHub Polish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 3"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource / Paper Link</label>
                <input
                  type="url"
                  placeholder="https://arxiv.org/abs/... or github.com/..."
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Implementation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Formulas, architectural tradeoffs, testing plan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600"
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
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
