export interface Student {
  id: string;
  name: string;
  program: string;
  semester: number;
  academicPerformance: number; // e.g. 81 (%)
  assignmentCompletion: number; // e.g. 94 (%)
  academicEffort: number; // e.g. 42 (hours)
}

export type EvidenceType = 'practical' | 'project' | 'theory' | 'reflection' | 'coding';

export interface Evidence {
  id: string;
  studentId: string;
  competencyId: string;
  type: EvidenceType;
  title: string;
  score: number; // 0 - 100 (%)
  date: string;
  source: string; // e.g. "Lab Practical Exam", "Midterm Theory Quiz", "GitHub Project Submission"
  relevance: 'High' | 'Medium' | 'Low';
  description?: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  targetScore: number;
}

export interface ScoringWeights {
  practical: number; // e.g. 40
  project: number;   // e.g. 30
  theory: number;    // e.g. 20
  reflection: number;// e.g. 10
  coding?: number;   // optional specific override
}

export interface ScoringConfiguration {
  id: string;
  name: string;
  weights: ScoringWeights;
  description: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  competencyId: string;
  title: string;
  preScore: number;  // e.g. 54%
  postScore: number; // e.g. 76%
  date: string;
}

export interface EffortRecord {
  id: string;
  studentId: string;
  competencyId?: string;
  category: string;
  hoursSpent: number;
  date: string;
  description: string;
}

export interface EvidenceContributionTrace {
  evidenceId: string;
  title: string;
  type: EvidenceType;
  rawScore: number;
  configuredWeight: number; // e.g. 40
  normalizedWeight: number; // e.g. 44.44%
  pointsContributed: number; // e.g. 17.33
}

export interface CompetencyEvaluation {
  competency: Competency;
  score: number; // 0 - 100 (%)
  status: 'Needs Improvement' | 'Developing' | 'Strong';
  confidence: 'High' | 'Medium' | 'Low';
  evidenceCount: number;
  evidenceBreakdown: EvidenceContributionTrace[];
  isPrimaryGap?: boolean;
  dissonanceReason?: string;
}

export interface LearningGainCalculation {
  assessmentId: string;
  competencyName: string;
  preScore: number;
  postScore: number;
  learningGain: number; // postScore - preScore
  label: string; // "Measured Learning Gain"
  disclaimer: string;
}

export interface EffortEfficiencyCalculation {
  totalEffortHours: number;
  baselineUnitHours: number;
  normalizedEffort: number;
  measuredLearningGain: number;
  effortEfficiency: number; // Learning Gain / Normalized Effort
  interpretation: string;
  disclaimer: string;
}

export interface CompetencyGap {
  competencyId: string;
  competencyName: string;
  score: number;
  status: 'Needs Improvement' | 'Developing' | 'Strong';
  isPrimaryGap: boolean;
  gapType: 'Practical Competency Gap' | 'Foundational Gap' | 'Developing Competency';
  theoryScore?: number;
  practicalScore?: number;
  divergence?: number;
  evidenceSummary: {
    theory?: number;
    coding?: number;
    project?: number;
    practical?: number;
  };
}

export interface Recommendation {
  id: string;
  competencyId: string;
  competencyName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedGap: string;
  evidenceSummary: string;
  reason: string;
  recommendedAction: string;
  status: 'pending' | 'completed';
}
