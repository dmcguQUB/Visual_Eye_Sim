// EyeTest, InvestigationsTest, and DiagnosisTest answers 
export interface EyeAndDiagnosisAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
}

export interface InvestigationsAnswer {
  questionId: string;
  userAnswers: string[];
  correctAnswers: string[];
}

// Test Types
export interface EyeTestType {
  answers: EyeAndDiagnosisAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
  percentage?: number;
}

export interface InvestigationsTestType {
  answers: InvestigationsAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
  percentage?: number;
}

export interface DiagnosisTestType {
  answers: EyeAndDiagnosisAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
  percentage?: number;
}

// Main Test model
export class Test {
  _id?: string;
  userId!: string;
  caseStudyId!: string;
  eyeTest?: EyeTestType;
  investigationsTest?: InvestigationsTestType;
  diagnosisTest?: DiagnosisTestType;
  totalScore?: number; // default value
  totalPercentage?: number; // default value
  createdAt?: Date; // Added from backend
  updatedAt?: Date; // Added from backend
  title?: string;  // making it optional using '?'

}

export interface TestResponse {
  test: Test;
}
