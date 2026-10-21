import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface DataSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSettingsModal: React.FC<DataSettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    tasks, 
    projects, 
    questions, 
    studySessions, 
    mockLogs, 
    exportDataJson, 
    importDataJson, 
    resetToDefault 
  } = useApp();

  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-engineer-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Backup downloaded successfully.', type: 'success' });
  };

  const handleImportJson = () => {
    if (!importText.trim()) {
      setStatusMessage({ text: 'Please paste valid JSON content to import.', type: 'error' });
      return;
    }
    const success = importDataJson(importText);
    if (success) {
      setStatusMessage({ text: 'Data imported and synced successfully.', type: 'success' });
      setImportText('');
    } else {
      setStatusMessage({ text: 'Invalid JSON format. Please verify your file contents.', type: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setStatusMessage({ text: `Imported backup from ${file.name}.`, type: 'success' });
      } else {
        setStatusMessage({ text: 'Could not parse the selected file as valid backup JSON.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all tasks, projects, notes, and interview data back to the default curated template? Any custom modifications will be replaced.')) {
      resetToDefault();
      setStatusMessage({ text: 'Reset completed to default curated template.', type: 'success' });
    }
  };

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.minutes, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Data Storage & Local Backups</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              100% standalone, stored directly in your browser with zero external server dependencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Storage Telemetry Stats */}
          <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-center">
            <div>
              <div className="text-xs text-slate-400">Tasks</div>
              <div className="text-lg font-semibold text-white font-mono tabular-nums">{tasks.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Projects</div>
              <div className="text-lg font-semibold text-white font-mono tabular-nums">{projects.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Questions</div>
              <div className="text-lg font-semibold text-white font-mono tabular-nums">{questions.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Study Mins</div>
              <div className="text-lg font-semibold text-white font-mono tabular-nums">{totalStudyMinutes}</div>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`flex items-center gap-2 p-3 text-xs rounded-lg ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                  : 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Export Action */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Export Snapshot</h4>
            <p className="text-xs text-slate-400">
              Download your complete state (roadmaps, STAR notes, customized interview questions, practice records) as a portable JSON file.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import Action */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Restore or Import Data</h4>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Upload JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500">or paste JSON text below</span>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON content here..."
              rows={3}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-slate-600"
            />
            {importText.trim() && (
              <button
                onClick={handleImportJson}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
              >
                Apply Imported Data
              </button>
            )}
          </div>

          {/* Reset Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-300">Restore Initial Curated Template</div>
              <div className="text-xs text-slate-500">Reverts to original AI engineering questions & tasks</div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Data</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
