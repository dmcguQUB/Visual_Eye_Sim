import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';//to get user info

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  //create user object
  user: any;

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService){}

  ngOnInit(): void {
   
  
  }

  startQuiz(){
    this.router.navigate(['/question']); // navigate to the quiz when Start button is clicked
  }
}
