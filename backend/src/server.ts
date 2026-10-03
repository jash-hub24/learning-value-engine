import express, { Request, Response } from 'express';
import cors from 'cors';
import { repository } from './data/repository.js';
import { ScoringEngine } from './services/scoringEngine.js';
import { LearningGainService } from './services/learningGainService.js';
import { EffortEfficiencyService } from './services/effortEfficiencyService.js';
import { GapDetectionService } from './services/gapDetectionService.js';
import { RecommendationService } from './services/recommendationService.js';
import { Evidence } from './types.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper: Calculate evaluated competencies dynamically
function getEvaluatedCompetencies() {
  const competencies = repository.getCompetencies();
  const config = repository.getScoringConfiguration();
  const allEvidence = repository.getEvidence();

  return competencies.map(comp => {
    const compEvidence = allEvidence.filter(e => e.competencyId === comp.id);
    return ScoringEngine.evaluateCompetency(comp, compEvidence, config);
  });
}

// 1. Student Profile
app.get('/api/student', (req: Request, res: Response) => {
  const student = repository.getStudent();
  res.json(student);
});

// 2. Evaluated Competencies (Dynamically calculated)
app.get('/api/competencies', (req: Request, res: Response) => {
  const evaluations = getEvaluatedCompetencies();
  res.json(evaluations);
});

// 3. Competency Trace Breakdown
app.get('/api/competencies/:id/trace', (req: Request, res: Response) => {
  const compId = req.params.id;
  const comp = repository.getCompetency(compId);
  if (!comp) {
    return res.status(404).json({ error: 'Competency not found' });
  }
  const config = repository.getScoringConfiguration();
  const evidence = repository.getEvidence(compId);
  const evaluation = ScoringEngine.evaluateCompetency(comp, evidence, config);
  res.json(evaluation);
});

// 4. Evidence Records
app.get('/api/evidence', (req: Request, res: Response) => {
  const compId = req.query.competencyId as string | undefined;
  const evidenceList = repository.getEvidence(compId);
  res.json(evidenceList);
});

app.post('/api/evidence', (req: Request, res: Response) => {
  const { competencyId, type, title, score, source, relevance, description } = req.body;
  if (!competencyId || !type || !title || score === undefined) {
    return res.status(400).json({ error: 'Missing required evidence fields' });
  }
  const newEv: Evidence = {
    id: `ev-${Date.now()}`,
    studentId: repository.getStudent().id,
    competencyId,
    type,
    title,
    score: Number(score),
    date: new Date().toISOString().split('T')[0],
    source: source || 'Student Assessment Portal',
    relevance: relevance || 'High',
    description: description || ''
  };
  const saved = repository.addEvidence(newEv);
  res.status(201).json(saved);
});

// 5. Scoring Configuration
app.get('/api/scoring-config', (req: Request, res: Response) => {
  const config = repository.getScoringConfiguration();
  res.json(config);
});

app.put('/api/scoring-config', (req: Request, res: Response) => {
  const { weights } = req.body;
  if (!weights) {
    return res.status(400).json({ error: 'Missing weights payload' });
  }
  const updated = repository.updateScoringConfiguration(weights);
  res.json(updated);
});

// 6. Assessments & Learning Gain
app.get('/api/assessments', (req: Request, res: Response) => {
  const assessments = repository.getAssessments();
  res.json(assessments);
});

app.get('/api/learning-gain', (req: Request, res: Response) => {
  const assessments = repository.getAssessments();
  if (assessments.length === 0) {
    return res.json({
      learningGain: 0,
      label: 'Measured Learning Gain',
      disclaimer: 'No pre/post assessment data available.'
    });
  }
  // Primary assessment (Backend Engineering Diagnostic)
  const primary = assessments[0];
  const comp = repository.getCompetency(primary.competencyId);
  const result = LearningGainService.calculateGain(primary, comp?.name || 'Backend Engineering');
  res.json(result);
});

// 7. Effort Efficiency (Prototype Metric)
app.get('/api/effort-efficiency', (req: Request, res: Response) => {
  const student = repository.getStudent();
  const assessments = repository.getAssessments();
  const gain = assessments.length > 0 ? (assessments[0].postScore - assessments[0].preScore) : 22;
  const result = EffortEfficiencyService.calculate(student.academicEffort, gain, 10);
  res.json(result);
});

// 8. Gap Detection
app.get('/api/gaps', (req: Request, res: Response) => {
  const evaluations = getEvaluatedCompetencies();
  const allEvidence = repository.getEvidence();
  const result = GapDetectionService.detectGaps(evaluations, allEvidence);
  res.json(result);
});

// 9. Recommendations
app.get('/api/recommendations', (req: Request, res: Response) => {
  const evaluations = getEvaluatedCompetencies();
  const allEvidence = repository.getEvidence();
  const { gaps } = GapDetectionService.detectGaps(evaluations, allEvidence);
  const recommendations = RecommendationService.generateRecommendations(gaps);
  res.json(recommendations);
});

// 10. Simulate Reassessment (Completes the Action -> Measured Improvement cycle)
app.post('/api/reassess', (req: Request, res: Response) => {
  const student = repository.getStudent();
  const newPracticalEvidence: Evidence = {
    id: `ev-reassess-${Date.now()}`,
    studentId: student.id,
    competencyId: 'comp-rest-api',
    type: 'practical',
    title: 'Post-Action Practical Lab: Spring Boot + MySQL API',
    score: 88, // Significant practical jump
    date: new Date().toISOString().split('T')[0],
    source: 'Verified Capstone Project Assessment',
    relevance: 'High',
    description: 'Successfully deployed Spring Boot 3 REST API with MySQL, Docker, JPA, and passing Postman test suites.'
  };

  repository.addEvidence(newPracticalEvidence);

  // Also log 8 hours of productive project effort
  repository.addEffortRecord({
    id: `eff-reassess-${Date.now()}`,
    studentId: student.id,
    competencyId: 'comp-rest-api',
    category: 'Spring Boot REST Implementation',
    hoursSpent: 8,
    date: new Date().toISOString().split('T')[0],
    description: 'Completed practical recommendation: Controller, Repository, Service implementation.'
  });

  // Update total academic effort
  repository.updateStudent({ academicEffort: student.academicEffort + 8 });

  // Update post-score of diagnostic assessment to reflect gain
  const assessments = repository.getAssessments();
  if (assessments.length > 0) {
    assessments[0].postScore = 88;
  }

  const evaluations = getEvaluatedCompetencies();
  const allEvidence = repository.getEvidence();
  const gapsData = GapDetectionService.detectGaps(evaluations, allEvidence);

  res.json({
    message: 'Practical reassessment completed successfully. Competency score recalculated and gap resolved.',
    newEvidence: newPracticalEvidence,
    evaluations,
    gaps: gapsData
  });
});

// 11. Reset State
app.post('/api/reset', (req: Request, res: Response) => {
  repository.reset();
  res.json({ message: 'Database reset to initial demo state successfully.' });
});

// Serve Frontend Production Build if present
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

app.use(express.static(frontendDist));
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Learning Value Engine Backend API listening on port ${PORT}`);
});

