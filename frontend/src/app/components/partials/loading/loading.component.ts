import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})


export class LoadingComponent implements OnInit, OnDestroy {  // Implement OnDestroy

  //create isLoading variable
  isLoading!: boolean;
  private subscription?: Subscription;  // Create a subscription variable


  //constructor which passes variable and calls service to determine if loading returning the isloading var and its value
  constructor(loadingService: LoadingService) {
    this.subscription = loadingService.isLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();  // Unsubscribe when component gets destroyed
  }

}
