import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  onTakeAction: () => void;
  isActionRunning: boolean;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onTakeAction,
  isActionRunning
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          Prescriptive Guidance
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          Evidence-Driven Recommendations
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          Derived deterministically from detected competency gaps and theory-vs-practice divergence. Every recommendation explicitly documents the underlying evidence and the specific diagnostic reason it was generated.
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isHighPriority = rec.priority === 'HIGH';
          const isCompleted = rec.status === 'completed';

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-6 transition shadow-xs ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : isHighPriority
                  ? 'bg-gradient-to-r from-rose-50/80 via-white to-amber-50/50 border-rose-200/90 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="space-y-3.5 flex-1">
                  {/* Badges & Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isHighPriority
                          ? 'bg-rose-600 text-white'
                          : rec.priority === 'MEDIUM'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {isCompleted ? 'ACTION COMPLETED' : `${rec.priority} PRIORITY`}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {rec.competencyName}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Detected Gap:</span>
                      <span className="text-rose-700">{rec.detectedGap}</span>
                    </h3>
                  </div>

                  {/* Evidence Analysis */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Evidence Grounding
                    </span>
                    <p className="font-semibold text-slate-800">{rec.evidenceSummary}</p>
                  </div>

                  {/* Reason (Section 15 requirement) */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Diagnostic Reason (WHY Generated)
                    </span>
                    <p className="leading-relaxed">{rec.reason}</p>
                  </div>

                  {/* Recommended Action (Section 15 requirement) */}
                  <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Prescribed Action
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-100">{rec.recommendedAction}</p>
                  </div>
                </div>

                {/* Action Trigger Box */}
                <div className="lg:w-64 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                      Reassessment Cycle
                    </span>
                    <p className="text-xs text-slate-600 mb-4">
                      Complete this practical project deliverable and trigger automatic verification to measure competency uplift.
                    </p>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-100 p-2.5 rounded-lg justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Action Verified & Scored</span>
                    </div>
                  ) : (
                    <button
                      onClick={onTakeAction}
                      disabled={isActionRunning}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow-sm transition disabled:opacity-50"
                    >
                      <span>Simulate Action Completed</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
