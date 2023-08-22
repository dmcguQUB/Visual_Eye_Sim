// Class to show the questions
// frontend/src/app/shared/models/quiz.ts 

import { Option } from "./option";

export class Question {
  _id!: string;
  questionText!: string;
  options!: Option[];
  explanation!: string;
  caseStudyId!: string;
  questionType?: 'eye-test' | 'investigation' | 'diagnosis'|null; // identify which type of question it is for 

  

  // Initialize in case an empty value is found within the search
  constructor() {
    this._id = '',
    this.questionText = '';
    this.options = [{text: '', correct: false}];
    this.explanation = '';
    this.caseStudyId = '';
    this.questionType;// assign null to start
  }
}

