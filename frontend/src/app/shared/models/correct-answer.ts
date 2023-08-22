import { Option } from "./option"; 

export interface CorrectAnswer {
  questionId: string;
  questionText: string;
  correctOptions: Option[];
}
