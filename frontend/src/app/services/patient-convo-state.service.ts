// patient-convo-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientConvoStateService {
  private _isPatientConvoFinished = new BehaviorSubject<boolean>(false);

  set isPatientConvoFinished(value: boolean) {
    this._isPatientConvoFinished.next(value);
  }

  get isPatientConvoFinished$() {
    return this._isPatientConvoFinished.asObservable();
  }
}
