import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { QuestionService } from 'src/app/services/questions.service'; // Import your service

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  user: any;
  useCaseId: any;
  loading: boolean = true; 
  totalQuestions?: number;  // Define totalQuestions variable

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService, private questionService: QuestionService){} // Inject your service

  ngOnInit(): void {
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
    this.getQuizDetails();  // Fetch quiz details
  }

  getQuizDetails() {
    this.questionService.getQuestionsByCaseStudyId(this.useCaseId).subscribe((questions) => {
      this.totalQuestions = questions.length;
      this.loading = false;
    });
  }

  startQuiz() {
    this.router.navigate(['/question', this.useCaseId]);
  }
}
