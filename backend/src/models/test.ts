// Import necessary modules from mongoose
import { Schema, model, Types } from 'mongoose';

// Define the Test interface to represent the structure of a test document
interface Test {
  userId: string; // User ID associated with the test
  caseStudyId: string; // Case study ID associated with the test
  eyeTest: {
    answers: {
      questionId: string; // ID of the question
      answer: string; // User's answer to the question
      correct: boolean; // Whether the answer is correct or not
    }[];
    score: number; // Score for the eye test
    totalQuestions?: number; // Total number of questions in the eye test
    correctAnswers?: number; // Number of correct answers in the eye test
    percentage?: number; // Percentage score for the eye test
  };
  investigationsTest: {
    answers: {
      questionId: string; // ID of the question
      userAnswers: string[]; // User's answers to the question (can be multiple)
      correctAnswers: string[]; // Correct answers to the question (can be multiple)
    }[];
    score: number; // Score for the investigations test
    totalQuestions?: number; // Total number of questions in the investigations test
    correctAnswers?: number; // Number of correct answers in the investigations test
    percentage?: number; // Percentage score for the investigations test
  };
  diagnosisTest: {
    answers: {
      questionId: string; // ID of the question
      answer: string; // User's answer to the question
      correct: boolean; // Whether the answer is correct or not
    }[];
    score: number; // Score for the diagnosis test
    totalQuestions?: number; // Total number of questions in the diagnosis test
    correctAnswers?: number; // Number of correct answers in the diagnosis test
    percentage?: number; // Percentage score for the diagnosis test
  };
  totalScore: number; // Total score for all test sections combined
  totalPercentage: number; // Total percentage score for all test sections combined
}

// Create a Mongoose schema for the Test document using the Test interface
const TestSchema = new Schema<Test>({
  userId: { type: String, ref: 'user', required: true }, // Reference to the User model
  caseStudyId: { type: String, required: true }, // ID of the associated case study
  eyeTest: {
    answers: [{
      questionId: { type: String, required: false }, // ID of the question
      answer: { type: String, required: false }, // User's answer to the question
      correct: { type: Boolean, required: false } // Whether the answer is correct or not
    }],
    score: { type: Number, required: false }, // Score for the eye test
    totalQuestions: { type: Number, required: false, default: 0 }, // Default value is 0
    correctAnswers: { type: Number, required: false, default: 0 }, // Default value is 0
    percentage: { type: Number, required: false }
  },
  investigationsTest: {
    answers: [{
      questionId: { type: String, required: false }, // ID of the question
      userAnswers: [{ type: String, required: false }], // User's answers to the question (can be multiple)
      correctAnswers: [{ type: String, required: false }] // Correct answers to the question (can be multiple)
    }],
    score: { type: Number, required: false }, // Score for the investigations test
    totalQuestions: { type: Number, required: false, default: 0 }, // Default value is 0
    correctAnswers: { type: Number, required: false, default: 0 }, // Default value is 0
    percentage: { type: Number, required: false }
  },
  diagnosisTest: {
    answers: [{
      questionId: { type: String, required: false }, // ID of the question
      answer: { type: String, required: false }, // User's answer to the question
      correct: { type: Boolean, required: false } // Whether the answer is correct or not
    }],
    score: { type: Number, required: false }, // Score for the diagnosis test
    totalQuestions: { type: Number, required: false, default: 0 }, // Default value is 0
    correctAnswers: { type: Number, required: false, default: 0 }, // Default value is 0
    percentage: { type: Number, required: false }
  },
  totalScore: { type: Number, required: false, default: 0 }, // Total score for all test sections combined
  totalPercentage: { type: Number, required: false, default: 0 } // Total percentage score for all test sections combined
}, {
  timestamps: true, // Add timestamps for created and updated at fields
  toJSON: {
    virtuals: true // Include virtual fields in JSON output
  },
  toObject: {
    virtuals: true // Include virtual fields when converting to an object
  }
});

// Create a Mongoose model for the Test document using the TestSchema
export const TestModel = model<Test>('test', TestSchema);
