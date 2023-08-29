import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/questions.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Question } from 'src/app/shared/models/question';
import { QuestionType } from 'src/app/shared/models/question-type';
import {
  Chart,
  ChartConfiguration,
  PieController,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
} from 'chart.js';
import { Test } from 'src/app/shared/models/test';
import { TestService } from 'src/app/services/test.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { HttpClient } from '@angular/common/http';
import { QUESTION_BY_ID_URL } from 'src/app/shared/constants/url';

Chart.register(PieController, Title, Tooltip, ArcElement, CategoryScale);

@Component({
  selector: 'app-user-scores',
  templateUrl: './user-scores.component.html',
  styleUrls: ['./user-scores.component.css'],
})
export class UserScoresComponent implements OnInit, OnDestroy {
  // Properties
  userId?: string;
  userTestCaseStudy?: CaseStudies;
  userTests?: Test[];
  selectedUserTest?: Test;
  loading: boolean = true;
  showDetailsSection: boolean = false;
  totalNumberOfQuestions?: number;
  totalScore?: number;
  scorePerQuestion: number = 1; // Set a default value if necessary or obtain from a service
  caseStudies: Record<string, CaseStudies> = {};
  allQuestions: Question[] = [];
  // properties for pagination
  pageSize: number = 5;
  currentPage: number = 1;
  currentSort: { column: string; direction: string } = {
    column: '',
    direction: 'asc',
  };
  questionsMap: {[id: string]: Question} = {};//map to map questions and user test answers together
  scoreChart?: Chart;//for chart



  private unsubscribe$ = new Subject<void>();

  constructor(
    private http: HttpClient,  // Add this
    private testService: TestService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService,
    private dataFilter: DataFilterService
  ) {}

  ngOnInit(): void {
    this.fetchUserScores();
    this.loadCaseStudies();
    this.loadAllQuestions();
  }

  ngOnDestroy(): void {
    // Ensure all subscriptions are unsubscribed from
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  fetchUserScores() {
    // Check if currentUser is defined and has a valid _id property
    if (this.userService.currentUser && this.userService.currentUser._id) {
      this.userId = this.userService.currentUser._id;
      this.loading = true;

      this.testService
        .getUserTestScores(this.userId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (userTests) => {
            this.userTests = userTests;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching user tests:', error);
            this.loading = false;
            // Optional: Implement user feedback, e.g.:
            // this.toastService.showError('Failed to fetch user scores.');
          }
        );
    } else {
      console.error('User ID is undefined or invalid.');
      this.loading = false;
    }
  }

  loadCaseStudies() {
    this.useCaseService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cs) => {
        cs.forEach((caseStudy) => {
          this.caseStudies[caseStudy._id] = caseStudy;
        });
      });
  }
  loadAllQuestions() {
    this.questionService
      .getAllQuestions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((questions) => {
        this.allQuestions = questions;
      });
  }

  getQuestionsByCaseStudyId(caseStudyId: string): Question[] {
    return this.allQuestions.filter((q:any) => q.caseStudyId === caseStudyId);
  }

  getQuestionsByCaseStudyIdAndQuestionType(
    caseStudyId: string,
    questionType: QuestionType
  ): Question[] {
    return this.allQuestions.filter(
      (q) => q.caseStudyId === caseStudyId && q.questionType === questionType
    );
  }

  async showDetails(test: Test) {
    this.loadQuestionsForTest(test);
    this.selectedUserTest = test;
    this.showDetailsSection = true;
  
    // Add this line to create the score chart for the selected test
    this.createScoreChart();
  }
  
   //button to close modal structure
   closeDetails() {
    this.showDetailsSection = false;
  }

  //in order to filter tables by created at or alphabetically
  sort(column: string) {
    if (this.currentSort.column === column) {
      this.currentSort.direction =
        this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    this.userTests = this.dataFilter.sort(
      this.userTests || [],
      column,
      this.currentSort.direction
    );
  }
  // You would also adjust the paginatedUserTests getter to use the service:
  get paginatedUserTests() {
    return this.dataFilter.paginate(
      this.userTests || [],
      this.pageSize,
      this.currentPage
    );
  }

  //previus page filter for button
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    // Update this logic based on how you're fetching or calculating the total number of pages
    if (this.currentPage * this.pageSize < (this.userTests?.length || 0)) {
      this.currentPage++;
    }
  }

  loadQuestionsForTest(test: Test) {
    const questions = this.getQuestionsByCaseStudyId(test.caseStudyId);
    questions.forEach(question => {
      this.questionsMap[question._id] = question;
    });
  }
  

  getCorrectAnswer(question: Question): string {
    if (!question || !question.options) {
        console.error("Invalid Question object provided");
        return "";
    }
    let correctOptions = question.options.filter(option => option.correct);
    return correctOptions.map(option => option.text).join(', ');
}

 
  
  
  createScoreChart() {
    // Destroy the existing chart if it exists
    if (this.scoreChart) {
      this.scoreChart.destroy();
    }

    // Check if the selected test score is set, otherwise exit
    if (!this.selectedUserTest) {
      console.error('Selected user test score is not set.');
      return;
    }
     // Check if the selected test score is set, otherwise assign a default value
    const correctPercentage = this.selectedUserTest?.totalPercentage || 0; // default to 0 if undefined
    const incorrectPercentage = 100 - correctPercentage;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Correct %', 'Incorrect %'],
        datasets: [
          {
            data: [correctPercentage, incorrectPercentage],
            backgroundColor: ['green', 'red'],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Score Distribution'
          }
        }
      },
    };
    this.scoreChart = new Chart('scoreChart', config);
  }

  }
  

