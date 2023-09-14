import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {
  // Using objects to maintain state for each case study by ID
  private _eyeTestStates: { [key: string]: BehaviorSubject<boolean> } = {};
  private _investigationTestStates: { [key: string]: BehaviorSubject<boolean> } = {};
  
  // ... more stages as needed

  // Helper function to get or initialize BehaviorSubject for a specific useCaseId
  private getOrCreateSubject(map: { [key: string]: BehaviorSubject<boolean> }, useCaseId: string): BehaviorSubject<boolean> {
    if (!map[useCaseId]) {
      map[useCaseId] = new BehaviorSubject<boolean>(false);
    }
    return map[useCaseId];
  }

  // For Eye Test
  setEyeTestFinished(useCaseId: string, value: boolean): void {
    const subject = this.getOrCreateSubject(this._eyeTestStates, useCaseId);
    subject.next(value);
  }

  isEyeTestFinished$(useCaseId: string) {
    return this.getOrCreateSubject(this._eyeTestStates, useCaseId).asObservable();
  }

  // For Investigations Test
  setInvestigationsTestFinished(useCaseId: string, value: boolean): void {
    const subject = this.getOrCreateSubject(this._investigationTestStates, useCaseId);
    subject.next(value);
  }

  isInvestigationsTestFinished$(useCaseId: string) {
    return this.getOrCreateSubject(this._investigationTestStates, useCaseId).asObservable();
  }

}
