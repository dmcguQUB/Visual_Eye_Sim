//loading service

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  //create loading variable with the subject of boolean (loading is default false). inform state of loading
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  //show loading method
  showLoading(){
    this.isLoadingSubject.next(true);
  }

  //hide loading method
  hideLoading(){
    this.isLoadingSubject.next(false);
  }

  //call get method to return the loading subjects
  get isLoading(){
    return this.isLoadingSubject.asObservable();
  }
}
