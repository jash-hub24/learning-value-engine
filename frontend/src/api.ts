import {
  Student,
  CompetencyEvaluation,
  Evidence,
  ScoringConfiguration,
  Assessment,
  LearningGainCalculation,
  EffortEfficiencyCalculation,
  CompetencyGap,
  Recommendation,
  ScoringWeights
} from './types';

const API_BASE = '/api';

export const api = {
  async getStudent(): Promise<Student> {
    const res = await fetch(`${API_BASE}/student`);
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  async getCompetencies(): Promise<CompetencyEvaluation[]> {
    const res = await fetch(`${API_BASE}/competencies`);
    if (!res.ok) throw new Error('Failed to fetch competencies');
    return res.json();
  },

  async getCompetencyTrace(id: string): Promise<CompetencyEvaluation> {
    const res = await fetch(`${API_BASE}/competencies/${id}/trace`);
    if (!res.ok) throw new Error('Failed to fetch competency trace');
    return res.json();
  },

  async getEvidence(competencyId?: string): Promise<Evidence[]> {
    const url = competencyId ? `${API_BASE}/evidence?competencyId=${competencyId}` : `${API_BASE}/evidence`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch evidence');
    return res.json();
  },

  async addEvidence(evidenceData: Partial<Evidence>): Promise<Evidence> {
    const res = await fetch(`${API_BASE}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData)
    });
    if (!res.ok) throw new Error('Failed to add evidence record');
    return res.json();
  },

  async getScoringConfig(): Promise<ScoringConfiguration> {
    const res = await fetch(`${API_BASE}/scoring-config`);
    if (!res.ok) throw new Error('Failed to fetch scoring configuration');
    return res.json();
  },

  async updateScoringConfig(weights: Partial<ScoringWeights>): Promise<ScoringConfiguration> {
    const res = await fetch(`${API_BASE}/scoring-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights })
    });
    if (!res.ok) throw new Error('Failed to update scoring configuration');
    return res.json();
  },

  async getAssessments(): Promise<Assessment[]> {
    const res = await fetch(`${API_BASE}/assessments`);
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
  },

  async getLearningGain(): Promise<LearningGainCalculation> {
    const res = await fetch(`${API_BASE}/learning-gain`);
    if (!res.ok) throw new Error('Failed to fetch learning gain');
    return res.json();
  },

  async getEffortEfficiency(): Promise<EffortEfficiencyCalculation> {
    const res = await fetch(`${API_BASE}/effort-efficiency`);
    if (!res.ok) throw new Error('Failed to fetch effort efficiency');
    return res.json();
  },

  async getGaps(): Promise<{ gaps: CompetencyGap[]; primaryGap: CompetencyGap | null }> {
    const res = await fetch(`${API_BASE}/gaps`);
    if (!res.ok) throw new Error('Failed to fetch gaps');
    return res.json();
  },

  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async simulateReassessment(): Promise<any> {
    const res = await fetch(`${API_BASE}/reassess`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trigger reassessment');
    return res.json();
  },

  async resetData(): Promise<any> {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset data');
    return res.json();
  }
};
