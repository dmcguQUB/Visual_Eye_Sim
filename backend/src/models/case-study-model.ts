import { model, Schema } from "mongoose";

export interface CaseStudy{
  id:string;
  name:string;
  imageUrl: string;
  age: string;
  gender:string;
  medicalHistory:string;
  drugInfo: string;
  socialInfo: string;
  familyHistory: string;

}

//setting schema for mongoDB 
export const CaseStudySchema = new Schema<CaseStudy>(
  {
    id: {type: String, required:true, unique: true},
    name: {type: String, required:true},
    imageUrl: {type: String, required:true},
    age: {type: String, required:true},
    gender: {type: String, required:true},
    medicalHistory: {type: String, required:true},
    drugInfo: {type: String, required:true},
    socialInfo: {type: String, required:true},
    familyHistory: {type: String, required:true},
  },{
    toJSON:{
      virtuals:true 
    },
    toObject:{
      virtuals:true
    },
    timestamps:true
  }
);

//create the model, that will take the model fo casestudy and send to Mongoose
export const CaseStudyModel = model<CaseStudy>('caseStudy', CaseStudySchema)