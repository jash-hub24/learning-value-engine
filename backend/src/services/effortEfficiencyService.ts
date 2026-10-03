import { EffortEfficiencyCalculation } from '../types.js';

export class EffortEfficiencyService {
  /**
   * Prototype Metric:
   * Effort Efficiency = Learning Gain / Normalized Effort
   *
   * Normalized Effort uses a 10-hour baseline unit (e.g. 42 hrs = 4.2 effort units).
   */
  public static calculate(
    totalEffortHours: number,
    learningGain: number,
    baselineUnitHours: number = 10
  ): EffortEfficiencyCalculation {
    const normalizedEffort = Math.max(0.1, totalEffortHours / baselineUnitHours);
    const rawEfficiency = learningGain / normalizedEffort;
    const efficiency = Math.round(rawEfficiency * 100) / 100;

    let interpretation = 'Balanced conversion of time investment into verified learning gains.';
    if (efficiency > 6.0) {
      interpretation = 'High yield: significant learning gain achieved relative to time invested.';
    } else if (efficiency < 3.0) {
      interpretation = 'Low yield: substantial effort spent with limited validated gain; practical bottlenecks likely.';
    }

    return {
      totalEffortHours,
      baselineUnitHours,
      normalizedEffort: Math.round(normalizedEffort * 10) / 10,
      measuredLearningGain: learningGain,
      effortEfficiency: efficiency,
      interpretation,
      disclaimer: 'Prototype measurement. Higher effort hours do not automatically imply competency. Attendance data is strictly excluded from competency valuation.'
    };
  }
}
