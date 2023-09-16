import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionStateServiceService {

  constructor() { }

  // The BehaviorSubject will keep the current state of the selection.
  private selectionState = new BehaviorSubject<string>("");

  // Function to update the current state.
  setSelectionState(state: string): void {
    this.selectionState.next(state);
  }

  // Get the current selection state as an Observable.
  getSelectionState$() {
    return this.selectionState.asObservable();
  }
}
