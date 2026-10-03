import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { CompetencyGap } from '../types';

interface PrimaryGapCardProps {
  primaryGap: CompetencyGap | null;
  onTakeAction: () => void;
  isActionRunning: boolean;
  onViewTrace?: (competencyId: string) => void;
}

export const PrimaryGapCard: React.FC<PrimaryGapCardProps> = ({
  primaryGap,
  onTakeAction,
  isActionRunning,
  onViewTrace
}) => {
  if (!primaryGap) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-2">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900">All Core Competencies On Track</h3>
        <p className="text-sm text-emerald-700 max-w-md mx-auto mt-1">
          No severe practical dissonance or sub-50% foundational gaps detected. Competency profile is balanced.
        </p>
      </div>
    );
  }

  const { evidenceSummary, competencyName, divergence, score, competencyId } = primaryGap;

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/50 rounded-2xl border-2 border-rose-200/80 p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-sm">
        Primary Learning Gap
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-4 flex-1">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{competencyName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Calculated Score: {score}%
                </span>
                {divergence && divergence > 20 && (
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    {divergence}% Practical Divergence Gap
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* WHY Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                WHY? (Evidence Diagnostic Breakdown)
              </h4>
              {onViewTrace && (
                <button
                  onClick={() => onViewTrace(competencyId)}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-0.5"
                >
                  View Math Trace <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-3">
              The student possesses strong conceptual understanding, but production capability is bottlenecked by practical execution:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <span className="text-[11px] font-semibold uppercase text-emerald-800 block">Theory</span>
                <span className="text-xl font-black text-emerald-700">
                  {evidenceSummary.theory ?? 82}%
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Concept Exam</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <span className="text-[11px] font-semibold uppercase text-amber-800 block">Coding</span>
                <span className="text-xl font-black text-amber-700">
                  {evidenceSummary.coding ?? 51}%
                </span>
                <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">Timed Lab</span>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                <span className="text-[11px] font-semibold uppercase text-orange-800 block">Project</span>
                <span className="text-xl font-black text-orange-700">
                  {evidenceSummary.project ?? 43}%
                </span>
                <span className="text-[10px] text-orange-600 block mt-0.5 font-medium">Milestone Repo</span>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                <span className="text-[11px] font-semibold uppercase text-rose-800 block">Practical</span>
                <span className="text-xl font-black text-rose-700">
                  {evidenceSummary.practical ?? 39}%
                </span>
                <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">Live Integration</span>
              </div>
            </div>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1.5 text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">RECOMMENDED ACTION</span>
            </div>
            <p className="text-sm font-semibold text-slate-100">
              Build a Spring Boot + MySQL REST API and complete a practical assessment.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Directly targets the 39% practical assessment deficit by implementing controller endpoints, MySQL persistence, and Postman validation suites.
            </p>
          </div>
        </div>

        {/* Action Button & Flow Guidance */}
        <div className="lg:w-64 flex flex-col justify-between bg-white/70 border border-rose-100 rounded-xl p-4">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Value Engine Loop
            </h5>
            <ol className="text-xs space-y-2 text-slate-600">
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>1. Effort Invested (42 hrs)</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>2. Evidence Evaluated</span>
              </li>
              <li className="flex items-center gap-1.5 text-rose-700 font-bold">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>3. Gap Detected (39% Practical)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">4</span>
                <span>4. Complete Action</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">5</span>
                <span>5. Measured Improvement</span>
              </li>
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={onTakeAction}
              disabled={isActionRunning}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow-sm transition disabled:opacity-50"
            >
              <span>Simulate Completing Action</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 block text-center mt-1.5">
              Simulates submitting Spring Boot project & reassessing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
