import React from 'react';
import {
  Brain,
  RotateCcw,
  Zap,
  LayoutDashboard,
  Target,
  FileCheck2,
  TrendingUp,
  Lightbulb,
  Sliders,
  UserCheck
} from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  student: Student | null;
  onSimulateReassessment: () => void;
  onReset: () => void;
  isActionRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  student,
  onSimulateReassessment,
  onReset,
  isActionRunning
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'competencies', label: 'Competency Profile', icon: Target },
    { id: 'evidence', label: 'Evidence Records', icon: FileCheck2 },
    { id: 'learning-gain', label: 'Learning Gain', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'scoring-config', label: 'Scoring Engine', icon: Sliders }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  LEARNING VALUE ENGINE
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                "We don't measure how much students do. We measure what their effort actually produces."
              </p>
            </div>
          </div>

          {/* Student Profile Quick View & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {student && (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">{student.name}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">{student.program} (Sem {student.semester})</span>
              </div>
            )}

            <button
              onClick={onSimulateReassessment}
              disabled={isActionRunning}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
              title="Simulates student completing the practical action and undergoing verified reassessment"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Simulate Reassessment</span>
            </button>

            <button
              onClick={onReset}
              disabled={isActionRunning}
              className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
              title="Reset data back to initial state"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border-b-2 border-sky-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
