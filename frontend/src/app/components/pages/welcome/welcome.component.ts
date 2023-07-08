import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @ViewChild('name') nameKey!: ElementRef;
  constructor(private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    
  }

  //using Viewchild and local storage to store name when you start the quiz
  startQuiz(){
    localStorage.setItem("name", this.nameKey.nativeElement.value);
  
  }


}
