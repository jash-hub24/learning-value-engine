import React from 'react';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';
import {
  Student,
  CompetencyEvaluation,
  CompetencyGap,
  LearningGainCalculation,
  EffortEfficiencyCalculation
} from '../types';
import { MetricCard } from '../components/MetricCard';
import { PrimaryGapCard } from '../components/PrimaryGapCard';
import { CompetencyChart } from '../components/CompetencyChart';

interface DashboardPageProps {
  student: Student | null;
  competencies: CompetencyEvaluation[];
  gaps: CompetencyGap[];
  primaryGap: CompetencyGap | null;
  learningGain: LearningGainCalculation | null;
  effortEfficiency: EffortEfficiencyCalculation | null;
  onSimulateAction: () => void;
  isActionRunning: boolean;
  onOpenTrace: (competencyId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  competencies,
  primaryGap,
  learningGain,
  effortEfficiency,
  onSimulateAction,
  isActionRunning,
  onOpenTrace
}) => {
  return (
    <div className="space-y-6">
      {/* Student Welcome & Core Value Philosophy Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Student Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">Semester {student?.semester || 4} • B.Tech</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {student?.name || 'Rahul Sharma'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Program: <strong className="text-slate-800">{student?.program || 'Computer Engineering'}</strong>. The Learning Value Engine evaluates what your effort actually yields in proven competencies, bypassing vanity activity logs.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Performance</span>
            <span className="text-lg font-black text-slate-900">{student?.academicPerformance}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assignments</span>
            <span className="text-lg font-black text-slate-900">{student?.assignmentCompletion}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Effort Log</span>
            <span className="text-lg font-black text-sky-700">{student?.academicEffort}h</span>
          </div>
        </div>
      </div>

      {/* Top 5 Core Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Academic Performance"
          value={student?.academicPerformance ?? 81}
          unit="%"
          subtitle="Coursework mark average"
          icon={GraduationCap}
          colorScheme="sky"
          tooltip="Standard university marks aggregate."
        />
        <MetricCard
          title="Assignment Completion"
          value={student?.assignmentCompletion ?? 94}
          unit="%"
          subtitle="Submitted deliverables"
          icon={CheckCircle}
          colorScheme="emerald"
          tooltip="Proportion of scheduled assignments submitted."
        />
        <MetricCard
          title="Academic Effort"
          value={student?.academicEffort ?? 42}
          unit="hrs"
          subtitle="Tracked study & lab hours"
          icon={Clock}
          colorScheme="amber"
          tooltip="Total recorded effort hours (lectures, labs, review)."
        />
        <MetricCard
          title="Measured Learning Gain"
          value={learningGain ? `+${learningGain.learningGain}` : '+22'}
          unit="pp"
          subtitle="Post − Pre Assessment"
          icon={TrendingUp}
          colorScheme="indigo"
          tooltip="Prototype pedagogical metric: difference between post and pre diagnostic assessments."
        />
        <MetricCard
          title="Effort Efficiency"
          value={effortEfficiency ? effortEfficiency.effortEfficiency : 5.24}
          unit="pts/unit"
          subtitle="Gain / Normalized Effort"
          icon={Zap}
          colorScheme="purple"
          tooltip="Prototype metric measuring verified learning gain generated per 10 hours of normalized effort."
        />
      </div>

      {/* PRIMARY LEARNING GAP CARD (Section 11 requirement) */}
      <PrimaryGapCard
        primaryGap={primaryGap}
        onTakeAction={onSimulateAction}
        isActionRunning={isActionRunning}
        onViewTrace={(id) => onOpenTrace(id)}
      />

      {/* Competency Overview Chart & Quick Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompetencyChart
            competencies={competencies}
            onSelectCompetency={(id) => onOpenTrace(id)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-4 w-4 text-sky-600" />
              Competency Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Click to Trace</span>
          </div>

          <div className="space-y-2.5">
            {competencies.map((comp) => {
              const isPrimary = primaryGap?.competencyId === comp.competency.id;
              return (
                <div
                  key={comp.competency.id}
                  onClick={() => onOpenTrace(comp.competency.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isPrimary
                      ? 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/60'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{comp.competency.name}</span>
                      {isPrimary && (
                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Gap
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {comp.evidenceCount} evidence artifacts
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">{comp.score}%</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        comp.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.status === 'Developing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
