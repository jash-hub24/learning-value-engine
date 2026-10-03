import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Student,
  Competency,
  Evidence,
  Assessment,
  EffortRecord,
  ScoringConfiguration,
  ScoringWeights
} from '../types.js';
import {
  initialStudent,
  initialCompetencies,
  initialEvidence,
  initialAssessments,
  initialEffortRecords,
  initialScoringConfiguration
} from './seedData.js';

interface DatabaseSchema {
  student: Student;
  competencies: Competency[];
  evidence: Evidence[];
  assessments: Assessment[];
  effortRecords: EffortRecord[];
  scoringConfiguration: ScoringConfiguration;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, 'store.json');

export class Repository {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing store.json, reinitializing from seed data.', err);
    }
    const initial = this.getFreshSeed();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  private getFreshSeed(): DatabaseSchema {
    return {
      student: { ...initialStudent },
      competencies: JSON.parse(JSON.stringify(initialCompetencies)),
      evidence: JSON.parse(JSON.stringify(initialEvidence)),
      assessments: JSON.parse(JSON.stringify(initialAssessments)),
      effortRecords: JSON.parse(JSON.stringify(initialEffortRecords)),
      scoringConfiguration: JSON.parse(JSON.stringify(initialScoringConfiguration))
    };
  }

  public reset(): DatabaseSchema {
    this.data = this.getFreshSeed();
    this.saveData(this.data);
    return this.data;
  }

  public getStudent(): Student {
    return this.data.student;
  }

  public updateStudent(updates: Partial<Student>): Student {
    this.data.student = { ...this.data.student, ...updates };
    this.saveData(this.data);
    return this.data.student;
  }

  public getCompetencies(): Competency[] {
    return this.data.competencies;
  }

  public getCompetency(id: string): Competency | undefined {
    return this.data.competencies.find(c => c.id === id);
  }

  public getEvidence(competencyId?: string): Evidence[] {
    if (competencyId) {
      return this.data.evidence.filter(e => e.competencyId === competencyId);
    }
    return this.data.evidence;
  }

  public addEvidence(evidence: Evidence): Evidence {
    this.data.evidence.push(evidence);
    this.saveData(this.data);
    return evidence;
  }

  public getScoringConfiguration(): ScoringConfiguration {
    return this.data.scoringConfiguration;
  }

  public updateScoringConfiguration(weights: Partial<ScoringWeights>): ScoringConfiguration {
    this.data.scoringConfiguration.weights = {
      ...this.data.scoringConfiguration.weights,
      ...weights
    };
    this.data.scoringConfiguration.updatedAt = new Date().toISOString();
    this.saveData(this.data);
    return this.data.scoringConfiguration;
  }

  public getAssessments(): Assessment[] {
    return this.data.assessments;
  }

  public addAssessment(assessment: Assessment): Assessment {
    this.data.assessments.push(assessment);
    this.saveData(this.data);
    return assessment;
  }

  public getEffortRecords(): EffortRecord[] {
    return this.data.effortRecords;
  }

  public addEffortRecord(effort: EffortRecord): EffortRecord {
    this.data.effortRecords.push(effort);
    this.saveData(this.data);
    return effort;
  }
}

export const repository = new Repository();
