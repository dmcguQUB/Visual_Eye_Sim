// Class to show the questions
// frontend/src/app/shared/models/quiz.ts 

export class Question {
  _id!: string;
  questionText!: string;
  options!: Option[];
  explanation!: string;
  caseStudyId!: string;

  // Initialize in case an empty value is found within the search
  constructor() {
    this._id = '',
    this.questionText = '';
    this.options = [{text: '', correct: false}];
    this.explanation = '';
    this.caseStudyId = '';
  }
}

export interface Option {
  text: string;
  correct: boolean;
}
