import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Database } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks & Sprints' },
    { id: 'portfolio', label: 'Portfolio Projects' },
    { id: 'interview', label: 'Interview Prep' },
    { id: 'skills', label: 'Skills Matrix' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-base font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          AI Engineer OS
        </button>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
                isActive
                  ? 'text-white font-semibold border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Data & Backups</span>
        </button>
      </div>
    </header>
  );
};
