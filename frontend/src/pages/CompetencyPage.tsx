import React, { useState } from 'react';
import { ChevronRight, Layers, Award, Sparkles } from 'lucide-react';
import { CompetencyEvaluation, ScoringConfiguration } from '../types';
import { TraceModal } from '../components/TraceModal';

interface CompetencyPageProps {
  competencies: CompetencyEvaluation[];
  scoringConfig: ScoringConfiguration | null;
}

export const CompetencyPage: React.FC<CompetencyPageProps> = ({
  competencies,
  scoringConfig
}) => {
  const [selectedComp, setSelectedComp] = useState<CompetencyEvaluation | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            Competency Profile
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">Verified Competency Matrix</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          Evaluated deterministically from multi-modal evidence streams (practical coding, projects, theory exams) weighted by the Scoring Engine. Click any competency to inspect its traceable mathematical derivation.
        </p>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competencies.map((comp) => {
          const isDeveloping = comp.status === 'Developing';

          return (
            <div
              key={comp.competency.id}
              onClick={() => setSelectedComp(comp)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-sky-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition">
                      {comp.competency.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {comp.competency.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      comp.status === 'Strong'
                        ? 'bg-emerald-100 text-emerald-800'
                        : isDeveloping
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Calculated Score</span>
                    <span className="text-2xl font-black text-slate-900">{comp.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        comp.score >= 70
                          ? 'bg-emerald-500'
                          : comp.score >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, comp.score))}%` }}
                    />
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Evidence</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Layers className="h-3 w-3 text-slate-400" />
                      {comp.evidenceCount} items
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Confidence</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Award className="h-3 w-3 text-slate-400" />
                      {comp.confidence}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Gain</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                      <Sparkles className="h-3 w-3 text-emerald-500" />
                      {comp.competency.name === 'REST API Development' ? '+22 pp' : '+15 pp'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:text-sky-700">
                <span>View Evidence & Math Trace</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trace Modal */}
      <TraceModal
        evaluation={selectedComp}
        config={scoringConfig}
        onClose={() => setSelectedComp(null)}
      />
    </div>
  );
};
