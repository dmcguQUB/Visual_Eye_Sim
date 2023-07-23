//frontend/src/app/services/questions.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../shared/models/question'; // Assuming you have defined the Quiz model
import { QUESTIONS_URL, QUESTION_BY_ID_URL, USER_SCORES_URL } from '../shared/constants/url';
import { UserScore } from '../shared/models/UserScore';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  // get all questions array. Using observable to throw error if there is an issue
  getAllQuestions(): Observable<Question[]> {
    // use http module with get the questions array using the questions url
    return this.http.get<Question[]>(QUESTIONS_URL);
  }

  // create a page for question when you click onto it. You only need a type of Quiz it is not an array type
  getQuestionsByCaseStudyId(caseStudyId: string): Observable<Question[]> {
    console.log('this is case study ID from backend' + caseStudyId);
    // search question by id
    return this.http.get<Question[]>(QUESTION_BY_ID_URL + caseStudyId);
  }

// post a user's score in the backend passing userScore object
postUserScore(userScore: any): Observable<any> {
  return this.http.post<UserScore>(USER_SCORES_URL, userScore);
}

}
