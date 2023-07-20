import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../shared/models/question'; // Assuming you have defined the Quiz model
import { QUESTIONS_URL, QUESTION_BY_ID_URL } from '../shared/constants/url';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http:HttpClient) { }

  // get all questions array. Using observable to throw error if there is an issue
  getAllQuestions(): Observable<Question[]> {
    // use http module with get the questions array using the questions url
    return this.http.get<Question[]>(QUESTIONS_URL);
  }

  // create a page for question when you click onto it. You only need a type of Quiz it is not an array type
  getQuestionById(questionId:string):Observable<Question>{
    console.log(questionId);
    // search question by id 
    return this.http.get<Question>(QUESTION_BY_ID_URL+questionId);
  }
}
