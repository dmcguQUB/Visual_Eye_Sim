//backend/src/models/case-study-model.ts
// Import required modules from the mongoose library
import { model, Schema } from "mongoose";

// Define an interface representing the structure of a CaseStudy
export interface CaseStudy {
  caseStudyNumber: number;
  name: string;
  imageUrl: string;
  age: string;
  gender: string;
  medicalHistory: string;
  drugInfo: string;
  socialInfo: string;
  familyHistory: string;
}

// Define the MongoDB schema for the CaseStudy
export const CaseStudySchema = new Schema<CaseStudy>(
  {
    caseStudyNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    medicalHistory: { type: String, required: true },
    drugInfo: { type: String, required: true },
    socialInfo: { type: String, required: true },
    familyHistory: { type: String, required: true },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true, // Automatically adds "createdAt" and "updatedAt" fields
  }
);

// Create the Mongoose model for the CaseStudy entity
export const CaseStudyModel = model<CaseStudy>('caseStudy', CaseStudySchema);
