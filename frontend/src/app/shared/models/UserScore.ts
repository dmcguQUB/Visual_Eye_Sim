//frontend/src/app/shared/models/UserScore.ts
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
}