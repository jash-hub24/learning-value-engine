import React, { useState, useEffect } from 'react';
import { api } from './api';
import {
  Student,
  CompetencyEvaluation,
  Evidence,
  Assessment,
  LearningGainCalculation,
  EffortEfficiencyCalculation,
  CompetencyGap,
  Recommendation,
  ScoringConfiguration,
  ScoringWeights
} from './types';
import { Navbar } from './components/Navbar';
import { TraceModal } from './components/TraceModal';
import { DashboardPage } from './pages/DashboardPage';
import { CompetencyPage } from './pages/CompetencyPage';
import { EvidencePage } from './pages/EvidencePage';
import { LearningGainPage } from './pages/LearningGainPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ScoringConfigPage } from './pages/ScoringConfigPage';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data States
  const [student, setStudent] = useState<Student | null>(null);
  const [competencies, setCompetencies] = useState<CompetencyEvaluation[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [learningGain, setLearningGain] = useState<LearningGainCalculation | null>(null);
  const [effortEfficiency, setEffortEfficiency] = useState<EffortEfficiencyCalculation | null>(null);
  const [gaps, setGaps] = useState<CompetencyGap[]>([]);
  const [primaryGap, setPrimaryGap] = useState<CompetencyGap | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scoringConfig, setScoringConfig] = useState<ScoringConfiguration | null>(null);

  // Interactive Actions State
  const [isActionRunning, setIsActionRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trace Modal state
  const [traceCompetency, setTraceCompetency] = useState<CompetencyEvaluation | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        studentData,
        competenciesData,
        evidenceData,
        assessmentsData,
        gainData,
        efficiencyData,
        gapsData,
        recommendationsData,
        configData
      ] = await Promise.all([
        api.getStudent(),
        api.getCompetencies(),
        api.getEvidence(),
        api.getAssessments(),
        api.getLearningGain(),
        api.getEffortEfficiency(),
        api.getGaps(),
        api.getRecommendations(),
        api.getScoringConfig()
      ]);

      setStudent(studentData);
      setCompetencies(competenciesData);
      setEvidenceList(evidenceData);
      setAssessments(assessmentsData);
      setLearningGain(gainData);
      setEffortEfficiency(efficiencyData);
      setGaps(gapsData.gaps);
      setPrimaryGap(gapsData.primaryGap);
      setRecommendations(recommendationsData);
      setScoringConfig(configData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to connect to Learning Value Engine API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSimulateReassessment = async () => {
    setIsActionRunning(true);
    try {
      await api.simulateReassessment();
      await loadAllData();
      showToast('Practical Reassessment Logged: REST API practical score rose to 88%! Competency score recalculated and gap resolved.');
    } catch (err: any) {
      console.error(err);
      showToast('Reassessment simulation failed: ' + err.message);
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleReset = async () => {
    setIsActionRunning(true);
    try {
      await api.resetData();
      await loadAllData();
      showToast('Demo student data reset to initial baseline state.');
    } catch (err: any) {
      console.error(err);
      showToast('Reset failed: ' + err.message);
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleAddEvidence = async (newEv: Partial<Evidence>) => {
    await api.addEvidence(newEv);
    await loadAllData();
    showToast(`Added new evidence "${newEv.title}". Scores recalculated!`);
  };

  const handleUpdateWeights = async (weights: Partial<ScoringWeights>) => {
    await api.updateScoringConfig(weights);
    await loadAllData();
    showToast('Scoring configuration weights updated! All competencies recalculated.');
  };

  const handleOpenTrace = (competencyId: string) => {
    const comp = competencies.find((c) => c.competency.id === competencyId);
    if (comp) {
      setTraceCompetency(comp);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  if (loading && !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="h-8 w-8 text-sky-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading Learning Value Engine...</p>
        <p className="text-xs text-slate-500 mt-1">Calculating competencies from evidence ledger</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-rose-200 rounded-2xl p-6 max-w-md w-full shadow-lg text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Backend Connection Error</h2>
          <p className="text-xs text-slate-600">{error}</p>
          <button
            onClick={loadAllData}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2 rounded-lg transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        student={student}
        onSimulateReassessment={handleSimulateReassessment}
        onReset={handleReset}
        isActionRunning={isActionRunning}
      />

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardPage
            student={student}
            competencies={competencies}
            gaps={gaps}
            primaryGap={primaryGap}
            learningGain={learningGain}
            effortEfficiency={effortEfficiency}
            onSimulateAction={handleSimulateReassessment}
            isActionRunning={isActionRunning}
            onOpenTrace={handleOpenTrace}
          />
        )}

        {currentTab === 'competencies' && (
          <CompetencyPage
            competencies={competencies}
            scoringConfig={scoringConfig}
          />
        )}

        {currentTab === 'evidence' && (
          <EvidencePage
            evidenceList={evidenceList}
            competencies={competencies}
            onAddEvidence={handleAddEvidence}
            onOpenTrace={handleOpenTrace}
          />
        )}

        {currentTab === 'learning-gain' && (
          <LearningGainPage
            assessments={assessments}
            learningGain={learningGain}
            effortEfficiency={effortEfficiency}
            student={student}
          />
        )}

        {currentTab === 'recommendations' && (
          <RecommendationsPage
            recommendations={recommendations}
            onTakeAction={handleSimulateReassessment}
            isActionRunning={isActionRunning}
          />
        )}

        {currentTab === 'scoring-config' && (
          <ScoringConfigPage
            config={scoringConfig}
            onUpdateWeights={handleUpdateWeights}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Persistent Trace Modal */}
      <TraceModal
        evaluation={traceCompetency}
        config={scoringConfig}
        onClose={() => setTraceCompetency(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            <strong>LEARNING VALUE ENGINE</strong> &bull; Evidence &bull; Learning Gain &bull; Competency &bull; Gap &bull; Action
          </p>
          <p className="text-[11px] text-slate-400">
            "We don't measure how much students do. We measure what their effort actually produces."
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
