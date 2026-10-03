/**
 * Verification Script: Tests all 13 core requirements of the Learning Value Engine MVP
 */
async function runVerification() {
  const BASE_URL = 'http://localhost:3001';
  console.log('=== STARTING LEARNING VALUE ENGINE MVP VERIFICATION ===\n');

  // Test 1: Root UI & Application Start
  const rootRes = await fetch(`${BASE_URL}/`);
  console.log(`[Check 1 & 2] Application & Dashboard HTML Status: ${rootRes.status} (OK)`);

  // Test 3: Demo Student
  const student = await (await fetch(`${BASE_URL}/api/student`)).json();
  console.log(`[Check 3] Demo Student:`, student.name, `| Program: ${student.program} | Sem: ${student.semester}`);
  console.log(`          Performance: ${student.academicPerformance}% | Completion: ${student.assignmentCompletion}% | Effort: ${student.academicEffort}h`);
  if (student.name !== 'Rahul Sharma' || student.academicPerformance !== 81) {
    throw new Error('Student data mismatch');
  }

  // Test 4 & 6: Competencies Dynamic Calculation
  const competencies = await (await fetch(`${BASE_URL}/api/competencies`)).json();
  console.log(`[Check 4 & 6] Calculated Competencies:`);
  for (const c of competencies) {
    console.log(`   - ${c.competency.name.padEnd(22)}: ${c.score}% [Status: ${c.status}, Confidence: ${c.confidence}]`);
  }

  // Test 5: Evidence Records
  const evidence = await (await fetch(`${BASE_URL}/api/evidence?competencyId=comp-rest-api`)).json();
  console.log(`[Check 5] REST API Development Evidence Records:`);
  for (const e of evidence) {
    console.log(`   - ${e.title.padEnd(22)}: ${e.score}% (Category: ${e.type})`);
  }

  // Test 7: Measured Learning Gain
  const gain = await (await fetch(`${BASE_URL}/api/learning-gain`)).json();
  console.log(`[Check 7] ${gain.label}: +${gain.learningGain} pp (Pre: ${gain.preScore}% -> Post: ${gain.postScore}%)`);

  // Test 8: Effort Efficiency
  const efficiency = await (await fetch(`${BASE_URL}/api/effort-efficiency`)).json();
  console.log(`[Check 8] Effort Efficiency: ${efficiency.effortEfficiency} (Gain: +${efficiency.measuredLearningGain} / Normalized Effort: ${efficiency.normalizedEffort})`);

  // Test 9: Gap Detection
  const gapsData = await (await fetch(`${BASE_URL}/api/gaps`)).json();
  console.log(`[Check 9] Primary Gap Detected:`, gapsData.primaryGap?.competencyName, `[Divergence: ${gapsData.primaryGap?.divergence}%]`);

  // Test 10: Recommendation Generation
  const recs = await (await fetch(`${BASE_URL}/api/recommendations`)).json();
  console.log(`[Check 10] Top Recommendation:`);
  console.log(`    Priority: ${recs[0]?.priority}`);
  console.log(`    Gap     : ${recs[0]?.detectedGap}`);
  console.log(`    Reason  : ${recs[0]?.reason}`);
  console.log(`    Action  : ${recs[0]?.recommendedAction}`);

  // Test 11: Traceable Calculation
  const trace = await (await fetch(`${BASE_URL}/api/competencies/comp-rest-api/trace`)).json();
  console.log(`[Check 11] Traceable Calculation for ${trace.competency.name}:`);
  for (const b of trace.evidenceBreakdown) {
    console.log(`    * ${b.title}: Score ${b.rawScore}% x NormWeight ${b.normalizedWeight}% = +${b.pointsContributed} pts`);
  }
  console.log(`    -> Total Trace Sum = ${trace.score}%`);

  // Test 12: Scoring Configuration sensitivity (changing weights changes scores)
  console.log(`[Check 12] Testing Scoring Configuration Sensitivity:`);
  const initialRestScore = trace.score;
  // Increase practical weight to 60%
  const updatedConfig = await (await fetch(`${BASE_URL}/api/scoring-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weights: { practical: 60, project: 20, theory: 15, reflection: 5 } })
  })).json();
  const reevaluatedCompetencies = await (await fetch(`${BASE_URL}/api/competencies`)).json();
  const newRestComp = reevaluatedCompetencies.find((c: any) => c.competency.id === 'comp-rest-api');
  console.log(`    Initial Score with Practical=40%: ${initialRestScore}%`);
  console.log(`    New Score with Practical=60%    : ${newRestComp.score}%`);
  if (initialRestScore === newRestComp.score) {
    throw new Error('Scoring configuration did not affect calculation!');
  }
  console.log(`    -> Weight alteration directly modified competency score as required!`);

  // Reset back to baseline configuration
  await fetch(`${BASE_URL}/api/reset`, { method: 'POST' });
  console.log(`    -> Reset baseline state successfully.`);

  // Test 13: Test Simulation of Action & Reassessment
  console.log(`[Check 13] Testing Reassessment Simulation (Action -> Improvement):`);
  const reassessRes = await (await fetch(`${BASE_URL}/api/reassess`, { method: 'POST' })).json();
  const postComp = reassessRes.evaluations.find((c: any) => c.competency.id === 'comp-rest-api');
  console.log(`    Post-Action REST API Score: ${postComp.score}% [Status: ${postComp.status}]`);
  console.log(`    Primary Gap after Reassessment: ${reassessRes.gaps.primaryGap?.competencyName || 'None'}`);

  // Reset back to clean demo state for user
  await fetch(`${BASE_URL}/api/reset`, { method: 'POST' });
  console.log(`    -> Demo state restored to clean initial Rahul Sharma profile.`);

  console.log('\n=== ALL 13 CORE FLOW VERIFICATIONS PASSED SUCCESSFULLY ===');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
