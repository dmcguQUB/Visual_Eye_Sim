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
  useCaseId:any;

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService){}

  ngOnInit(): void {
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
  
  }

  startQuiz() {
    this.router.navigate(['/question', this.useCaseId]);
  }
}
