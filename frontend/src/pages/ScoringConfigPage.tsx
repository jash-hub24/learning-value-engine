import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { ScoringConfiguration, ScoringWeights } from '../types';

interface ScoringConfigPageProps {
  config: ScoringConfiguration | null;
  onUpdateWeights: (weights: Partial<ScoringWeights>) => Promise<void>;
  onReset?: () => void;
}

export const ScoringConfigPage: React.FC<ScoringConfigPageProps> = ({
  config,
  onUpdateWeights
}) => {
  const [practical, setPractical] = useState<number>(40);
  const [project, setProject] = useState<number>(30);
  const [theory, setTheory] = useState<number>(20);
  const [reflection, setReflection] = useState<number>(10);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (config) {
      setPractical(config.weights.practical || 40);
      setProject(config.weights.project || 30);
      setTheory(config.weights.theory || 20);
      setReflection(config.weights.reflection || 10);
    }
  }, [config]);

  const rawSum = practical + project + theory + reflection;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateWeights({
        practical,
        project,
        theory,
        reflection
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (prac: number, proj: number, theo: number, refl: number) => {
    setPractical(prac);
    setProject(proj);
    setTheory(theo);
    setReflection(refl);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          Scoring Rules Engine
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">Configurable Competency Scoring</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          Configure deterministic evidence attribution weights stored in <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">ScoringConfiguration</code>. Updates immediately trigger dynamic recalculation across all competencies, gap detection rules, and the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders & Configuration Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">Evidence Category Weights</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                rawSum === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Configured Sum: {rawSum}%
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Practical Slider */}
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">Practical Assessment Weight</label>
                  <span className="text-[11px] text-slate-500">Hands-on labs, compiler test benches, live coding</span>
                </div>
                <span className="text-lg font-black text-emerald-700">{practical}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={practical}
                onChange={(e) => setPractical(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Project Evidence Slider */}
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">Project Evidence Weight</label>
                  <span className="text-[11px] text-slate-500">Capstone repositories, course milestones, deliverables</span>
                </div>
                <span className="text-lg font-black text-amber-700">{project}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={project}
                onChange={(e) => setProject(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Concept/Theory Slider */}
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">Concept / Theory Assessment Weight</label>
                  <span className="text-[11px] text-slate-500">Written exams, conceptual quizzes, architecture questions</span>
                </div>
                <span className="text-lg font-black text-sky-700">{theory}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={theory}
                onChange={(e) => setTheory(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Reflection Slider */}
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">Reflection Weight</label>
                  <span className="text-[11px] text-slate-500">Self-evaluations, code reviews, retrospective logs</span>
                </div>
                <span className="text-lg font-black text-purple-700">{reflection}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={reflection}
                onChange={(e) => setReflection(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Weights Saved & Scores Recalculated!
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-sm transition disabled:opacity-50"
              >
                <Sliders className="h-4 w-4" />
                <span>{isSaving ? 'Recalculating...' : 'Update Weights & Recalculate Engine'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Presets & Normalization Guidance */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Weight Calibration Presets
            </h3>
            <p className="text-xs text-slate-500">
              Instantly toggle curriculum assessment profiles to test engine sensitivity:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => applyPreset(40, 30, 20, 10)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition text-xs"
              >
                <span className="font-bold text-slate-900 block">Default Engine (40 / 30 / 20 / 10)</span>
                <span className="text-slate-500 text-[11px]">Practical 40%, Project 30%, Theory 20%, Reflection 10%</span>
              </button>

              <button
                onClick={() => applyPreset(60, 25, 10, 5)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition text-xs"
              >
                <span className="font-bold text-slate-900 block">Hands-on Engineering (60 / 25 / 10 / 5)</span>
                <span className="text-slate-500 text-[11px]">Heavily penalizes students with weak practical lab execution.</span>
              </button>

              <button
                onClick={() => applyPreset(10, 20, 60, 10)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition text-xs"
              >
                <span className="font-bold text-slate-900 block">Theoretical Academy (10 / 20 / 60 / 10)</span>
                <span className="text-slate-500 text-[11px]">Rewards written memory and exam retention.</span>
              </button>
            </div>
          </div>

          {/* Normalization Math Box */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-xs text-sky-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="h-4 w-4 text-sky-600" />
              <span>Automatic Normalization Invariant</span>
            </div>
            <p className="text-sky-900 text-[11px] leading-relaxed">
              If a student lacks an evidence stream (e.g. no reflection artifact has been filed), the scoring engine does not assign a zero. Instead, it computes:
            </p>
            <div className="bg-white/80 border border-sky-200 rounded-lg p-2.5 font-mono text-[11px] text-sky-900">
              w_norm(i) = w(i) / &sum; [w(available)]
            </div>
            <p className="text-sky-800 text-[11px]">
              This guarantees mathematical fairness across diverse courses without arbitrary score deflation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
