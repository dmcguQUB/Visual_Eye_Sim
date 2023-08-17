// Import required modules from the mongoose library
import { model, Schema, Document } from "mongoose";

// Define an interface representing the structure of an Option within a quiz question
interface Option {
  text: string;
  correct: boolean;
}

// Define a Mongoose schema for the Option interface
const OptionSchema = new Schema<Option>({
  text: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

// Define an interface representing the structure of a Quiz question
export interface Quiz {
  questionText: string;
  options: Option[];
  explanation: string;
  caseStudyId: string; // This is used to link questions to a specific case study.
  questionType: 'eye-test' | 'investigation' | 'diagnosis'; // identify which type of question it is for 
}

// Define the Mongoose schema for the Quiz interface
export const QuizSchema = new Schema<Quiz>({
  questionText: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  explanation: { type: String, required: true },
  caseStudyId: { type: String, required: true },
  questionType: { type: String, enum: ['eye-test', 'investigation', 'diagnosis'], required: true }, // add enum to prevent different values being selected
}, {
  toJSON: {
    virtuals: true 
  },
  toObject: {
    virtuals: true
  },
  timestamps: true // Automatically adds "createdAt" and "updatedAt" fields
});

// Create the Mongoose model for the Quiz entity
export const QuizModel = model<Quiz & Document>('Quiz', QuizSchema);
