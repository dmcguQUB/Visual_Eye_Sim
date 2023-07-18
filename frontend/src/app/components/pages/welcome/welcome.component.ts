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
    this.auth.user$.subscribe(user => {
      this.user = user;//subscribe to the user to populate their name in test
      localStorage.setItem("name", this.user.nickname); // store user's nickname in local storage
    });
  }

  startQuiz(){
    this.router.navigate(['/question']); // navigate to the quiz when Start button is clicked
  }
}
