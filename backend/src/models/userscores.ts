// Import required modules from mongoose
import { model, Schema, Document } from "mongoose";

// Define the structure of a user's answer to a question
interface UserAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}

// Define a Mongoose schema for the UserAnswer interface
const UserAnswerSchema = new Schema<UserAnswer>({
  questionId: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

// Define the structure of a user's score record
export interface UserScore {
  userId: string;
  caseStudyId: string;
  score: number;
  answers: UserAnswer[];
  testTakenAt: Date;
}

// Create a Mongoose schema for the UserScore entity
export const UserScoreSchema = new Schema<UserScore>({
  userId: { type: String, required: true },
  caseStudyId: { type: String, required: true },
  score: { type: Number, required: true },
  answers: { type: [UserAnswerSchema], required: true },
  testTakenAt: { type: Date, required: true },
}, {
  toJSON: {
    virtuals: true 
  },
  toObject: {
    virtuals: true
  },
  timestamps: true  // Automatically adds "createdAt" and "updatedAt" fields
});

// Create the Mongoose model for the UserScore entity
export const UserScoreModel = model<UserScore & Document>('UserScore', UserScoreSchema);
