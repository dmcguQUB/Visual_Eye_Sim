//this is a class to intercept communication between front and backend to display loading to improve UX
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
//create global variable of pending requests. Show loading when pending requests are >0 until it is 0.
var pendingRequests = 0;
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  // we are using loading service in constructor
  constructor(private loadingService: LoadingService) {}

  //we can see what requests are being sent to the server. Then see what is the next thing that needs to happen.

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //use loading service to show loading 
    this.loadingService.showLoading();
    pendingRequests = pendingRequests+1;

    return next.handle(request).pipe(
      tap({
        next:(event) => {
          //if the event type requests is same as the response (e.g. request is finished)
          if(event.type === HttpEventType.Response){
            //hide the loading
            this.handleHideLoading();
          }
        },
        //if there is an error hide loading
        error: (_) => {
          this.handleHideLoading();
        }
      })
    );
  }

  //handle hide loading method 
  handleHideLoading(){
    //opposte of before which decreases pending requests
    pendingRequests = pendingRequests-1;
    //if they are 0
    if(pendingRequests === 0)
    //hide loading
    this.loadingService.hideLoading();
  }
}
