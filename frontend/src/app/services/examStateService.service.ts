// shared service to store the state of whether the eye examination test is finished. This service will act as a bridge between the QuestionComponent and the NavbarComponent

// exam-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {
  private _isEyeTestFinished = new BehaviorSubject<boolean>(false);
  private _isInvestigationsTestFinished = new BehaviorSubject<boolean>(false);
  
  // ... you can add more stages as needed

  // For Eye Test
  set isEyeTestFinished(value: boolean) {
    this._isEyeTestFinished.next(value);
  }
  get isEyeTestFinished$() {
    return this._isEyeTestFinished.asObservable();
  }

  // For Investigations Test
  set isInvestigationsTestFinished(value: boolean) {
    this._isInvestigationsTestFinished.next(value);
  }
  get isInvestigationsTestFinished$() {
    return this._isInvestigationsTestFinished.asObservable();
  }
}
