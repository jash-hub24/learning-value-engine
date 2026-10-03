import React from 'react';
import {
  ArrowRight,
  Info,
  Zap,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  Assessment,
  LearningGainCalculation,
  EffortEfficiencyCalculation,
  Student
} from '../types';

interface LearningGainPageProps {
  assessments: Assessment[];
  learningGain: LearningGainCalculation | null;
  effortEfficiency: EffortEfficiencyCalculation | null;
  student: Student | null;
}

export const LearningGainPage: React.FC<LearningGainPageProps> = ({
  assessments,
  learningGain,
  effortEfficiency,
  student
}) => {
  const currentAssessment = assessments[0] || {
    title: 'Backend Engineering Diagnostic Assessment',
    preScore: 54,
    postScore: 76,
    date: '2026-09-29'
  };

  const gainValue = learningGain ? learningGain.learningGain : (currentAssessment.postScore - currentAssessment.preScore);

  const comparisonData = [
    { stage: 'Pre-Assessment', score: currentAssessment.preScore, fill: '#64748b' },
    { stage: 'Post-Assessment', score: currentAssessment.postScore, fill: '#0284c7' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          Value Metric
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">Measured Learning Gain</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          Quantifies delta performance across standardized pre- and post-diagnostic assessments. Validates whether invested student effort produced quantifiable conceptual and practical uplift.
        </p>
      </div>

      {/* Main Learning Gain Hero Card */}
      <div className="bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/40 rounded-2xl border border-sky-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Primary Assessment Series
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {currentAssessment.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Competency: <strong className="text-slate-700">REST API Development</strong> • Diagnostic Cycle
              </p>
            </div>

            {/* Pre -> Post Visual Callout */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="text-center px-4 py-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Pre-Assessment</span>
                <span className="text-3xl font-extrabold text-slate-600">{currentAssessment.preScore}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Baseline</span>
              </div>

              <div className="flex flex-col items-center px-2">
                <ArrowRight className="h-6 w-6 text-sky-600 animate-pulse" />
                <span className="text-[10px] font-bold text-sky-700 uppercase mt-1">Growth</span>
              </div>

              <div className="text-center px-4 py-1">
                <span className="text-[11px] font-bold text-sky-700 uppercase block">Post-Assessment</span>
                <span className="text-3xl font-black text-sky-700">{currentAssessment.postScore}%</span>
                <span className="text-[10px] text-sky-600 block mt-0.5">Verified</span>
              </div>

              <div className="h-12 w-px bg-slate-200 mx-2" />

              <div className="text-center px-4 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Measured Learning Gain</span>
                <span className="text-3xl font-black text-emerald-700">+{gainValue}</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">percentage points</span>
              </div>
            </div>

            {/* Scientific Disclaimer (Prompt Requirement) */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Prototype Measurement Notice</span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  "Measured Learning Gain" represents empirical change between specific pre- and post-instruments. We do NOT claim that this is a universally scientifically validated measurement.
                </p>
              </div>
            </div>
          </div>

          {/* Simple Chart Visualization (Section 14 requirement) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:w-80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Pre vs Post Assessment Comparison
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Score']}
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`gain-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                &Delta; +{gainValue} percentage points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Effort Efficiency Prototype Metric (Section 8 requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Prototype Metric: Effort Efficiency</h3>
              <p className="text-xs text-slate-500">
                Formula: Effort Efficiency = Measured Learning Gain / Normalized Effort
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            Experimental Index
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-xs font-semibold uppercase text-slate-500 block">Measured Learning Gain</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">+{gainValue} pts</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Post-assessment delta</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-xs font-semibold uppercase text-slate-500 block">Normalized Effort Units</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {effortEfficiency ? effortEfficiency.normalizedEffort : 4.2} units
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {student?.academicEffort ?? 42} hrs / 10h baseline
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <span className="text-xs font-semibold uppercase text-purple-800 block">Effort Efficiency Yield</span>
            <span className="text-3xl font-black text-purple-700 mt-0.5 block">
              {effortEfficiency ? effortEfficiency.effortEfficiency : 5.24}
            </span>
            <span className="text-[10px] text-purple-600 font-bold uppercase block mt-1">
              Gain points per effort unit
            </span>
          </div>
        </div>

        {/* Pedagogical Transparency Policy Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Info className="h-4 w-4 text-sky-600" />
            <span>Pedagogical Principles & Constraints</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-slate-600">
            <li>
              <strong>Effort is not an output:</strong> Spending 40+ hours in a lecture hall or studying slides does not guarantee mastery. The system measures what effort actually yields in observable competency evidence.
            </li>
            <li>
              <strong>Attendance Exclusion:</strong> Attendance records are strictly forbidden from being counted as direct evidence of competency in this engine.
            </li>
            <li>
              <strong>Continuous Calibration:</strong> As the student completes targeted practical actions and reassessments, the effort efficiency index adjusts dynamically.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
