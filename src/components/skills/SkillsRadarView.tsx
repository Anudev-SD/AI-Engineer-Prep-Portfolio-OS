import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, ArrowRight, BarChart2 } from 'lucide-react';

export const SkillsRadarView: React.FC = () => {
  const { skillTracks, updateSkillLevel, setActiveTab } = useApp();

  // Calculate totals
  let totalCurrent = 0;
  let totalTarget = 0;
  let totalMax = 0;

  skillTracks.forEach((t) => {
    t.items.forEach((item) => {
      totalCurrent += item.level;
      totalTarget += item.targetLevel;
      totalMax += 5;
    });
  });

  const overallCurrentPct = Math.round((totalCurrent / totalMax) * 100);
  const overallTargetPct = Math.round((totalTarget / totalMax) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Engineering Skills Matrix</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Self-assess your competencies across production AI dimensions to identify gaps before interview loops.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 self-start md:self-auto">
          <div>
            <div className="text-xs text-slate-400">Current Readiness</div>
            <div className="text-lg font-bold font-mono tabular-nums text-white">
              {overallCurrentPct}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400">Target Benchmark</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              {overallTargetPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Track Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillTracks.map((track) => {
          const trackCurrent = track.items.reduce((acc, i) => acc + i.level, 0);
          const trackMax = track.items.length * 5;
          const trackPct = Math.round((trackCurrent / trackMax) * 100);

          return (
            <div
              key={track.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5"
            >
              {/* Track Title & Aggregate Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">{track.title}</h2>
                  <span className="text-xs font-mono tabular-nums text-emerald-400 font-medium">
                    {trackPct}% Mastery
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {track.description}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${trackPct}%` }}
                  />
                </div>
              </div>

              {/* Individual Skill Items */}
              <div className="space-y-4 pt-2">
                {track.items.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200">{skill.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{skill.description}</div>
                      </div>

                      {/* Interactive Level Buttons (1 to 5) */}
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isFilled = lvl <= skill.level;
                          const isTarget = lvl === skill.targetLevel;
                          return (
                            <button
                              key={lvl}
                              onClick={() => updateSkillLevel(track.id, skill.id, lvl)}
                              className={`w-6 h-6 rounded text-xs font-mono transition-all cursor-pointer ${
                                isFilled
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : isTarget
                                  ? 'bg-slate-800 border border-emerald-500/50 text-emerald-400'
                                  : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white'
                              }`}
                              title={`Rate level ${lvl} of 5 (Target: ${skill.targetLevel})`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Core concepts list */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-800/50">
                      <span className="text-xs text-slate-500">Key Concepts:</span>
                      {skill.coreConcepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-2 py-0.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded text-slate-300"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Next Action Footer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Target Interview Readiness Strategy</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Aim for Level 4+ across Transformer Internals and RAG Systems to comfortably clear senior technical screening rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('interview')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Practice Weakest Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
