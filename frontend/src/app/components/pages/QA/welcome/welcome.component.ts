import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute, private questionService: QuestionService){} // Inject your service

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
    this.router.navigate(['/eye-test-questions', this.useCaseId]);
  }
}
