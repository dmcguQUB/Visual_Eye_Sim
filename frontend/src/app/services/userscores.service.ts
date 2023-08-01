//frontend/src/app/services/questions.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_SCORES_URL } from '../shared/constants/url';
import { UserScore } from '../shared/models/UserScore';

@Injectable({
  providedIn: 'root',
})
export class UserScoreService {
  constructor(private http: HttpClient) {}

  // Fetch user scores by user ID
  getUserScores(userId: string): Observable<UserScore[]> {
    const url = `${USER_SCORES_URL}/user/${userId}`;
    return this.http.get<UserScore[]>(url);
  }

  //fetch global scores for admin to see all the correct and incorrect answers by case study for all users
  getCorrectAndIncorrectAnswers(
    caseStudyId: string
  ): Observable<{ correct: number; incorrect: number }> {
    const url = `${USER_SCORES_URL}/case-study/${caseStudyId}`;
    return this.http.get<{ correct: number; incorrect: number }>(url);
  }

  // fetch average scores over time for a specific case study
  getAverageScoresOverTimePerCaseStudy(
    caseStudyId: string
  ): Observable<
    Array<{ date: string; averageScore: number; userCount: number }>
  > {
    const url = `${USER_SCORES_URL}/case-study/${caseStudyId}/average-score-over-time`;
    return this.http.get<
      Array<{ date: string; averageScore: number; userCount: number }>
    >(url);
  }
}
