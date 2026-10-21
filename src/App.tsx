/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { InterviewPrepView } from './components/interviews/InterviewPrepView';
import { SkillsRadarView } from './components/skills/SkillsRadarView';
import { DataSettingsModal } from './components/settings/DataSettingsModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Strict Top Bar Contract Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'interview' && <InterviewPrepView />}
        {activeTab === 'skills' && <SkillsRadarView />}
      </main>

      {/* Quiet Informational Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            AI Engineer Career & Interview OS · Standalone local storage
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>No external databases required</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Backup & Settings Modal */}
      <DataSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
