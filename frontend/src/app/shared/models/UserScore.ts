//frontend/src/app/shared/models/UserScore.ts

import { CaseStudies } from "./casestudies";

//model for userScore object
export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}
export class UserScore {
  userId!: string;
  caseStudyId!: string;
  score!: number;
  answers!: UserAnswer[];
  testTakenAt!: Date;
  questions?: any[]; // Change the type to match the Question model if available
  caseStudy?: CaseStudies; // Add caseStudy property to store case study detail
}