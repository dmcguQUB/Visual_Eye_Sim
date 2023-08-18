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

  getAllUserScores(): Observable<UserScore[]> {
    return this.http.get<UserScore[]>(`${USER_SCORES_URL}`);
  }

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

  getCorrectAndIncorrectAnswersWithDates(
    caseStudyId: string,
    startDate: string,
    endDate: string
  ): Observable<{ correct: number; incorrect: number }> {
    const url = `${USER_SCORES_URL}/case-study/${caseStudyId}/answers-in-dates`;
    return this.http.get<{ correct: number; incorrect: number }>(url, {
      params: { startDate, endDate },
    });
  }

  // Fetch the latest user score for a specific user and case study
  getLatestUserScore(
    userId: string,
    caseStudyId: string
  ): Observable<UserScore | null> {
    const url = `${USER_SCORES_URL}/latest/${userId}/${caseStudyId}`;
    return this.http.get<UserScore | null>(url); // Return type could be UserScore or null
  }

  // Update a user score
  updateUserScore(score: UserScore): Observable<UserScore> {
    const url = `${USER_SCORES_URL}/${score.score}`; // Assuming that the score has an _id field
    return this.http.put<UserScore>(url, score);
  }

  // Update the latest score of a user for a specific case study with a new test score
  updateLatestUserScore(
    userId: string,
    caseStudyId: string,
    newTestScore: number
  ): Observable<UserScore> {
    const url = `${USER_SCORES_URL}/update-latest/${userId}/${caseStudyId}`;
    return this.http.patch<UserScore>(url, { score: newTestScore });
  }
}
