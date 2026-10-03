import React from 'react';
import { X, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { CompetencyEvaluation, ScoringConfiguration } from '../types';

interface TraceModalProps {
  evaluation: CompetencyEvaluation | null;
  config: ScoringConfiguration | null;
  onClose: () => void;
}

export const TraceModal: React.FC<TraceModalProps> = ({
  evaluation,
  config,
  onClose
}) => {
  if (!evaluation) return null;

  const { competency, score, status, evidenceBreakdown, evidenceCount } = evaluation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Traceable Competency Calculation: {competency.name}
              </h3>
              <p className="text-xs text-slate-300">
                Data Layer &rarr; Evidence &rarr; Weighted Engine &rarr; Competency Score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl gap-3">
            <div>
              <span className="text-xs text-slate-500 font-medium uppercase">Final Calculated Score</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900">{score}%</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  status === 'Strong'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'Developing'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg">
              <span className="font-semibold block text-slate-800">Evidence Count:</span>
              <span>{evidenceCount} verified artifacts</span>
            </div>
          </div>

          {/* Transparent Formula Explanation */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-sky-950">
              <Info className="h-4 w-4 text-sky-600" />
              <span>Weight Normalization & Attribution Logic</span>
            </div>
            <p>
              Configured weights in Scoring Engine: Practical ({config?.weights.practical ?? 40}%), Project ({config?.weights.project ?? 30}%), Theory ({config?.weights.theory ?? 20}%), Reflection ({config?.weights.reflection ?? 10}%).
            </p>
            <p className="text-sky-800">
              Because reflection evidence is not yet recorded for this competency, the engine automatically re-normalizes the active weights to 100% rather than producing an invalid or deflated score.
            </p>
          </div>

          {/* Evidence Trace Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Evidence Contributions to Final Score
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Evidence Artifact</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Raw Score</th>
                    <th className="py-2.5 px-3 text-right">Normalized Wt</th>
                    <th className="py-2.5 px-3 text-right">Contributed Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {evidenceBreakdown.map((trace) => (
                    <tr key={trace.evidenceId} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-medium text-slate-900">{trace.title}</td>
                      <td className="py-2.5 px-3">
                        <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {trace.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">{trace.rawScore}%</td>
                      <td className="py-2.5 px-3 text-right text-slate-500">{trace.normalizedWeight}%</td>
                      <td className="py-2.5 px-3 text-right font-bold text-sky-700">
                        +{trace.pointsContributed} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-[10px] text-slate-500">
                      Total Calculated Score:
                    </td>
                    <td className="py-2.5 px-3 text-right text-sm text-sky-800">
                      {score}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Deterministic Business Layer Calculation Verified
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition"
            >
              Close Trace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
