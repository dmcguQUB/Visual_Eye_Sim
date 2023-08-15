// shared service to store the state of whether the eye examination test is finished. This service will act as a bridge between the QuestionComponent and the NavbarComponent

// exam-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {
  private _isEyeExaminationTestFinished = new BehaviorSubject<boolean>(false);
  
  set isEyeExaminationTestFinished(value: boolean) {
    this._isEyeExaminationTestFinished.next(value);
  }

  get isEyeExaminationTestFinished$() {
    return this._isEyeExaminationTestFinished.asObservable();
  }
}
