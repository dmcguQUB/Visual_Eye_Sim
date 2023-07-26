
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

 }}