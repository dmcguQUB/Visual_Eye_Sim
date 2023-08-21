import { ObjectId } from 'mongodb';
import { Schema, model, Types } from 'mongoose';

interface Test {
  userId: string;
  caseStudyId: string;
  eyeTest: {
    answers: {
      questionId: string;
      answer: string;
      correct: boolean;
    }[];
    score: number;
    totalQuestions?: number;
    correctAnswers?: number;
  };
  investigationsTest: {
    answers: {
      questionId: string;
      userAnswers: string[];
      correctAnswers: string[];
    }[];
    score: number;
    totalQuestions?: number;
    correctAnswers?: number;
  };
  diagnosisTest: {
    answers: {
      questionId: string;
      answer: string;
      correct: boolean;
    }[];
    score: number;
    totalQuestions?: number;
    correctAnswers?: number;
  };
}

const TestSchema = new Schema<Test>({
  userId: { type: String, ref: 'user', required: true },
  caseStudyId: { type: String, required: true },
  eyeTest: {
    answers: [{
      questionId: { type: String, required: false },
      answer: { type: String, required: false },
      correct: { type: Boolean, required: false }
    }],
    score: { type: Number, required: false },
    totalQuestions: { type: Number, required: false, default: 0 },
    correctAnswers: { type: Number, required: false, default: 0 }
  },
  investigationsTest: {
    answers: [{
      questionId: { type: String, required: false },
      userAnswers: [{ type: String, required: false }],
      correctAnswers: [{ type: String, required: false }]
    }],
    score: { type: Number, required: false },
    totalQuestions: { type: Number, required: false, default: 0 },
    correctAnswers: { type: Number, required: false, default: 0 }
  },
  diagnosisTest: {
    answers: [{
      questionId: { type: String, required: false },
      answer: { type: String, required: false },
      correct: { type: Boolean, required: false }
    }],
    score: { type: Number, required: false },
    totalQuestions: { type: Number, required: false, default: 0 },
    correctAnswers: { type: Number, required: false, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

export const TestModel = model<Test>('test', TestSchema);
