import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonStateService {

  private buttonSource = new BehaviorSubject(false);
  currentButtonState = this.buttonSource.asObservable();

  constructor() { }

  changeButtonState(state: boolean) {
    this.buttonSource.next(state);
  }
}
