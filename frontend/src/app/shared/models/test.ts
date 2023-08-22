// Model for eyeTest and diagnosisTest answers object
export interface EyeAndDiagnosisAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
}

// Model for investigationsTest answers object
export interface InvestigationsAnswer {
  questionId: string;
  userAnswers: string[];
  correctAnswers: string[];  // Based on your previous note, kept this but you can remove if needed
}

// Model for eyeTest
export interface EyeTestType {
  answers: EyeAndDiagnosisAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

// Model for investigationsTest
export interface InvestigationsTestType {
  answers: InvestigationsAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

// Model for diagnosisTest
export interface DiagnosisTestType {
  answers: EyeAndDiagnosisAnswer[];
  score: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

// Main model for Test object
export class Test {
  _id?: string; // assuming you want the ObjectId from the database
  userId!: string;
  caseStudyId!: string;
  eyeTest?: EyeTestType;
  investigationsTest?: InvestigationsTestType;
  diagnosisTest?: DiagnosisTestType;
  createdAt?: Date;  // If you need timestamps
  updatedAt?: Date;  // If you need timestamps
}

export interface TestResponse {
  test: Test;
  testId: string; // This seems redundant since you also have _id in Test. Consider removing one or the other.
}
