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
  correctAnswers: string[];  // You can decide whether to include correctAnswers in the frontend model based on your security considerations
}

// Model for eyeTest, investigationsTest, and diagnosisTest
export interface TestType {
  answers: (EyeAndDiagnosisAnswer | InvestigationsAnswer)[];
  score: number;
}

// Main model for Test object
export class Test {
  userId!: string;
  caseStudyId!: string;
  eyeTest?: TestType;
  investigationsTest?: TestType;
  diagnosisTest?: TestType;
  createdAt?: Date;  // If you need timestamps
  updatedAt?: Date;  // If you need timestamps
}
