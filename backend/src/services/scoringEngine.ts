import {
  Competency,
  Evidence,
  EvidenceContributionTrace,
  CompetencyEvaluation,
  ScoringConfiguration,
  EvidenceType
} from '../types.js';

export class ScoringEngine {
  /**
   * Calculates the competency score dynamically from evidence records
   * using the provided scoring configuration weights.
   * Handles weight normalization if certain evidence categories (e.g. reflection) are absent.
   */
  public static evaluateCompetency(
    competency: Competency,
    evidenceList: Evidence[],
    config: ScoringConfiguration
  ): CompetencyEvaluation {
    const traces: EvidenceContributionTrace[] = [];

    if (!evidenceList || evidenceList.length === 0) {
      return {
        competency,
        score: 0,
        status: 'Needs Improvement',
        confidence: 'Low',
        evidenceCount: 0,
        evidenceBreakdown: []
      };
    }

    // 1. Group evidence by category
    const grouped: Record<string, Evidence[]> = {
      practical: [],
      project: [],
      theory: [],
      reflection: []
    };

    for (const ev of evidenceList) {
      if (ev.type === 'practical' || ev.type === 'coding') {
        grouped.practical.push(ev);
      } else if (ev.type === 'project') {
        grouped.project.push(ev);
      } else if (ev.type === 'theory') {
        grouped.theory.push(ev);
      } else if (ev.type === 'reflection') {
        grouped.reflection.push(ev);
      } else {
        // Fallback for any other type into practical
        grouped.practical.push(ev);
      }
    }

    // 2. Determine which categories have active evidence
    const availableCategories: string[] = [];
    let activeWeightSum = 0;

    const weights = config.weights;
    const categoryWeights: Record<string, number> = {
      practical: weights.practical || 0,
      project: weights.project || 0,
      theory: weights.theory || 0,
      reflection: weights.reflection || 0
    };

    for (const cat of ['practical', 'project', 'theory', 'reflection']) {
      if (grouped[cat].length > 0 && categoryWeights[cat] > 0) {
        availableCategories.push(cat);
        activeWeightSum += categoryWeights[cat];
      }
    }

    // Fallback if weights sum to 0
    if (activeWeightSum === 0) {
      activeWeightSum = 100;
      for (const cat of availableCategories) {
        categoryWeights[cat] = 100 / availableCategories.length;
      }
    }

    // 3. Calculate normalized weights and contributions for each evidence record
    let totalCalculatedScore = 0;

    for (const cat of availableCategories) {
      const records = grouped[cat];
      const catConfigWeight = categoryWeights[cat];
      // Category's normalized percentage of 100
      const catNormalizedWeight = (catConfigWeight / activeWeightSum) * 100;

      // Each evidence record in this category shares the category weight equally
      const itemConfigWeight = catConfigWeight / records.length;
      const itemNormalizedWeight = catNormalizedWeight / records.length;

      for (const ev of records) {
        const contribution = (ev.score * (itemNormalizedWeight / 100));
        totalCalculatedScore += contribution;

        traces.push({
          evidenceId: ev.id,
          title: ev.title,
          type: ev.type,
          rawScore: ev.score,
          configuredWeight: Math.round(itemConfigWeight * 10) / 10,
          normalizedWeight: Math.round(itemNormalizedWeight * 100) / 100,
          pointsContributed: Math.round(contribution * 100) / 100
        });
      }
    }

    const finalScore = Math.round(totalCalculatedScore * 10) / 10;

    // 4. Status determination according to Section 9:
    // If competency score < 50: status = "Needs Improvement"
    // If competency score >= 50 and < 70: status = "Developing"
    // If competency score >= 70: status = "Strong"
    let status: 'Needs Improvement' | 'Developing' | 'Strong';
    if (finalScore < 50) {
      status = 'Needs Improvement';
    } else if (finalScore < 70) {
      status = 'Developing';
    } else {
      status = 'Strong';
    }

    // 5. Confidence rating based on evidence density
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    if (evidenceList.length >= 3 && availableCategories.length >= 3) {
      confidence = 'High';
    } else if (evidenceList.length <= 1) {
      confidence = 'Low';
    }

    return {
      competency,
      score: finalScore,
      status,
      confidence,
      evidenceCount: evidenceList.length,
      evidenceBreakdown: traces
    };
  }
}
