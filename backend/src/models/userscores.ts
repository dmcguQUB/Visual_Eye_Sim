// backend/src/models/userScores.ts
import { model, Schema, Document } from "mongoose";

interface UserAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}

const UserAnswerSchema = new Schema<UserAnswer>({
  questionId: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

export interface UserScore {
  userId: string;
  caseStudyId: string;
  score: number;
  answers: UserAnswer[];
  testTakenAt: Date;
}

export const UserScoreSchema = new Schema<UserScore>({
  userId: { type: String, required: true },
  caseStudyId: { type: String, required: true },
  score: { type: Number, required: true },
  answers: { type: [UserAnswerSchema], required: true },
  testTakenAt: { type: Date, required: true },
},
{
  toJSON: {
    virtuals: true 
  },
  toObject: {
    virtuals: true
  },
  timestamps: true
});

export const UserScoreModel = model<UserScore & Document>('UserScore', UserScoreSchema);
