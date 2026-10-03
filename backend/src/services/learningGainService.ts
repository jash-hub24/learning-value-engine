import { Assessment, LearningGainCalculation } from '../types.js';

export class LearningGainService {
  /**
   * Computes the Measured Learning Gain from pre and post assessments:
   * Learning Gain = Post Assessment − Pre Assessment
   */
  public static calculateGain(
    assessment: Assessment,
    competencyName: string = 'Backend Engineering'
  ): LearningGainCalculation {
    const learningGain = assessment.postScore - assessment.preScore;

    return {
      assessmentId: assessment.id,
      competencyName,
      preScore: assessment.preScore,
      postScore: assessment.postScore,
      learningGain: Math.round(learningGain * 10) / 10,
      label: 'Measured Learning Gain',
      disclaimer: 'Prototype pedagogical metric: post-assessment minus pre-assessment. Not claimed as a universal scientific standard.'
    };
  }
}
