//frontend/src/app/services/test.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CASE_STUDY_BY_ID_URL, TEST_FOR_ALL_TESTS_AND_CASE_STUDIES, TEST_FOR_CASE_STUDY, TEST_FOR_USER_URL, TEST_URL } from '../shared/constants/url';
import { Test } from '../shared/models/test';

@Injectable({
  providedIn: 'root',
})
export class TestService {

  //constructor
  constructor(private http: HttpClient) {}

  //works
  //1) get all test scores
  getAllTestScores(): Observable<Test[]> {
    return this.http.get<Test[]>(`${TEST_URL}`);
  }

  //works
  //2) get user's test scores
    // Fetch user scores by user ID
    getUserTestScores(userId: string): Observable<Test[]> {
      const url = `${TEST_FOR_USER_URL}${userId}`;
      return this.http.get<Test[]>(url);
    }

 // 3) Aggregate scores and answers for each specific test within a specific case study
 getTestScoresForCaseStudy(caseStudyId: string): Observable<Test> {
  const url = `${TEST_FOR_CASE_STUDY}${caseStudyId}`;
  return this.http.get<Test>(url);
}

// 4) Global scores and answers across all tests and case studies
getTestScoresAllTestsAllCaseStudies(): Observable<any> {
  const url = `${TEST_FOR_ALL_TESTS_AND_CASE_STUDIES}`;
  return this.http.get<any>(url);
}

// 5) Average percentage score for each case study over time
getAverageTestPercentageForCaseStudyOverTime(caseStudyId: string): Observable<any> {
  const url = `${CASE_STUDY_BY_ID_URL}${caseStudyId}/average-score-over-time`;
  return this.http.get<any>(url);
}
//6) Post test scores to database
// Submit test data
submitTestData(testData: any): Observable<Test> {
  return this.http.post<Test>(TEST_URL, testData);
}

 // The new method to calculate score
 calculateScore(userId: string): Observable<any> {
  return this.http.post<any>(`${TEST_URL}calculate_score/${userId}`, {});
}

//fetch user scores after being calculated
fetchUserScore(userId: string,caseStudyId:string ): Observable<any> {
  return this.http.get<any>(`${TEST_URL}/user/${userId}/case_study/${caseStudyId}`, {});
}
}
