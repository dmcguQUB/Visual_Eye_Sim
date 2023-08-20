// shared service to store the state of whether the eye examination test is finished. This service will act as a bridge between the QuestionComponent and the NavbarComponent

// exam-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {
  private _isTestFinished = new BehaviorSubject<boolean>(false);
  
  set isTestFinished(value: boolean) {
    this._isTestFinished.next(value);
  }

  get isTestFinished$() {
    return this._isTestFinished.asObservable();
  }
}
