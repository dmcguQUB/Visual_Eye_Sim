//create questions schema
import { model, Schema, Document } from "mongoose";

interface Option {
  text: string;
  correct: boolean;
}

const OptionSchema = new Schema<Option>({
  text: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

export interface Quiz {
  questionText: string;
  options: Option[];
  explanation: string;
  caseStudyId: string; // This is used to link questions to a specific case study.
}

//setting schema for MongoDB 
export const QuizSchema = new Schema<Quiz>({
  questionText: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  explanation: { type: String, required: true },
  caseStudyId: { type: String, required: true },
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

//create the model, that will take the model of Quiz and send to Mongoose
export const QuizModel = model<Quiz & Document>('Quiz', QuizSchema);

