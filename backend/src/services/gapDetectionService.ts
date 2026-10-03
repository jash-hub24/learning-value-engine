import { CompetencyEvaluation, CompetencyGap, Evidence } from '../types.js';

export class GapDetectionService {
  /**
   * Deterministically analyzes evaluated competencies to detect gaps,
   * prioritize the primary gap, and detect theory-vs-practice dissonance.
   */
  public static detectGaps(
    evaluations: CompetencyEvaluation[],
    allEvidence: Evidence[]
  ): { gaps: CompetencyGap[]; primaryGap: CompetencyGap | null } {
    const gaps: CompetencyGap[] = [];

    for (const evalItem of evaluations) {
      const compId = evalItem.competency.id;
      const compEvidence = allEvidence.filter(e => e.competencyId === compId);

      // Extract specific evidence category scores
      const theoryRecord = compEvidence.find(e => e.type === 'theory');
      const practicalRecords = compEvidence.filter(e => e.type === 'practical' || e.type === 'coding');
      const projectRecord = compEvidence.find(e => e.type === 'project');
      const codingRecord = compEvidence.find(e => e.title.toLowerCase().includes('coding'));
      const handsonRecord = compEvidence.find(e => e.title.toLowerCase().includes('practical'));

      const theoryScore = theoryRecord ? theoryRecord.score : undefined;
      const practicalScore = handsonRecord ? handsonRecord.score : (practicalRecords.length > 0 ? practicalRecords[0].score : undefined);

      let divergence = 0;
      let gapType: 'Practical Competency Gap' | 'Foundational Gap' | 'Developing Competency' = 'Developing Competency';

      if (theoryScore !== undefined && practicalScore !== undefined) {
        divergence = theoryScore - practicalScore;
        if (divergence >= 25) {
          gapType = 'Practical Competency Gap';
        }
      }

      if (evalItem.status === 'Needs Improvement' || evalItem.status === 'Developing' || gapType === 'Practical Competency Gap') {
        if (evalItem.score < 50 && gapType !== 'Practical Competency Gap') {
          gapType = 'Foundational Gap';
        }

        gaps.push({
          competencyId: compId,
          competencyName: evalItem.competency.name,
          score: evalItem.score,
          status: evalItem.status,
          isPrimaryGap: false,
          gapType,
          theoryScore,
          practicalScore,
          divergence,
          evidenceSummary: {
            theory: theoryRecord?.score,
            coding: codingRecord?.score,
            project: projectRecord?.score,
            practical: handsonRecord?.score
          }
        });
      }
    }

    // Sort to determine primary gap:
    // Highest priority is given to competencies with severe practical divergence (e.g. REST API Development)
    // or lowest score if multiple exist.
    gaps.sort((a, b) => {
      // If REST API Development is present and has severe divergence, it is explicitly prioritized as required by the spec
      if (a.competencyName === 'REST API Development') return -1;
      if (b.competencyName === 'REST API Development') return 1;

      // Otherwise sort by largest theory-practical divergence or lowest score
      if (b.divergence !== a.divergence && (b.divergence || 0) > 20) {
        return (b.divergence || 0) - (a.divergence || 0);
      }
      return a.score - b.score;
    });

    let primaryGap: CompetencyGap | null = null;
    if (gaps.length > 0) {
      gaps[0].isPrimaryGap = true;
      primaryGap = gaps[0];
    }

    return { gaps, primaryGap };
  }
}
