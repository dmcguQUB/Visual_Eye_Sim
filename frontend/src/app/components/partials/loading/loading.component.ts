import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})


export class LoadingComponent implements OnInit {

  //create isLoading variable
  isLoading!: boolean;

  //constructor which passes variable and calls service to determine if loading returning the isloading var and its value
  constructor(loadingService: LoadingService) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

   }

  ngOnInit(): void {
  }

}
