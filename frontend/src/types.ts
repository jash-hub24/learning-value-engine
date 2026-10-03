export interface Student {
  id: string;
  name: string;
  program: string;
  semester: number;
  academicPerformance: number;
  assignmentCompletion: number;
  academicEffort: number;
}

export type EvidenceType = 'practical' | 'project' | 'theory' | 'reflection' | 'coding';

export interface Evidence {
  id: string;
  studentId: string;
  competencyId: string;
  type: EvidenceType;
  title: string;
  score: number;
  date: string;
  source: string;
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
  practical: number;
  project: number;
  theory: number;
  reflection: number;
  coding?: number;
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
  preScore: number;
  postScore: number;
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
  configuredWeight: number;
  normalizedWeight: number;
  pointsContributed: number;
}

export interface CompetencyEvaluation {
  competency: Competency;
  score: number;
  status: 'Needs Improvement' | 'Developing' | 'Strong';
  confidence: 'High' | 'Medium' | 'Low';
  evidenceCount: number;
  evidenceBreakdown: EvidenceContributionTrace[];
  isPrimaryGap?: boolean;
}

export interface LearningGainCalculation {
  assessmentId: string;
  competencyName: string;
  preScore: number;
  postScore: number;
  learningGain: number;
  label: string;
  disclaimer: string;
}

export interface EffortEfficiencyCalculation {
  totalEffortHours: number;
  baselineUnitHours: number;
  normalizedEffort: number;
  measuredLearningGain: number;
  effortEfficiency: number;
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
