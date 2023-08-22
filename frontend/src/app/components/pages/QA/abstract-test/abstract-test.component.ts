import { Component, Input, OnDestroy } from '@angular/core'; // Import OnDestroy
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { Question } from 'src/app/shared/models/question';
import { User } from 'src/app/shared/models/User';
import { TestService } from 'src/app/services/test.service';
import {
  EyeAndDiagnosisAnswer,
  InvestigationsAnswer,
} from 'src/app/shared/models/test';
import { QuestionType } from 'src/app/shared/models/question-type';

@Component({
  template: '', // an empty template, since this won't be used directly
})
export abstract class AbstractTestComponent implements OnDestroy {
  // Implement OnDestroy

  public name: string = '';
  public questionList: Question[] = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  public counter: number = 0; // we'll initialize it properly inside ngOnInit
  public isTestFinished: boolean = false; // adding to change the state of the navbar to unlock investigations
  public loading: boolean = true;
  testAnswers: (EyeAndDiagnosisAnswer | InvestigationsAnswer)[] = [];
  questionText: string = '';
  interval$: Subscription | undefined;
  progress: string = '0'; //to update progress bar
  isQuizCompleted: boolean = false;
  useCaseId: any = '';
  currentUser: User = new User();
  userId: string = '';
  userSubscription$: Subscription | undefined;  // Add a new state variable to track loading status

  //user must select which type of test it is
  @Input() public questionType: QuestionType | undefined;

  //constructor
  constructor(
    protected questionsService: QuestionService,
    protected route: ActivatedRoute,
    protected userService: UserService,
    protected examStateService: ExamStateService,
    protected testService: TestService
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
    // Set the total duration for the test based on the number of questions fetched
    this.getQuestionsForUseCase();
    this.startCounter(); //start counter
    this.userSubscription$ = this.userService.userObservable.subscribe(
      (user) => {
        this.currentUser = user;
        if (user && user._id) {
          // Check if _id is defined
          this.userId = user._id; // get userId from UserService
          console.log(this.userId); // to check if userId is getting assigned correctly
        } else {
          console.error('userId is undefined');
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Implement ngOnDestroy to unsubscribe
    this.interval$?.unsubscribe();
    this.userSubscription$?.unsubscribe();
  }

  //get questions
  getQuestionsForUseCase() {
    console.log('This is case study from question component' + this.useCaseId);
    if (this.useCaseId) {
      this.questionsService.getQuestionsByCaseStudyId(this.useCaseId).subscribe(
        (res) => {
          console.log('API Response:', res);

          // Filter the questions for question type
          this.questionList = res.filter(
            (question) => question.questionType === this.questionType
          );

          // Initialize the testAnswers array based on the test type - use switch statement
          switch (this.questionType) {
            //if the question type is eye test or diagnosis (single choice answers)
            case QuestionType.EyeTest:
            case QuestionType.Diagnosis:
              this.questionList.forEach(() =>
                this.testAnswers.push({
                  questionId: '',
                  answer: '',
                  correct: false,
                })
              );
              break;

            //if question type investigations (multiple choice questioons)
            case QuestionType.Investigations:
              console.log('Investigations Questions:', this.questionList);

              // If the Investigations test has a different initialization logic, you can add it here
              // For now, we'll keep it similar
              this.questionList.forEach(() =>
                this.testAnswers.push({
                  questionId: '',
                  userAnswers: [],
                  correctAnswers: [],
                })
              );

              break;
          }

          // Set the total timer after fetching the questions
          this.counter = 60 * this.questionList.length;
          this.startCounter();

          // Set loading to false now that we have the data
          this.loading = false;
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      console.error('useCaseId is null');
    }
  }

  // Method to go to the next question
  nextQuestion() {
    if (this.currentQuestion < this.questionList.length - 1) {
      // Make sure we don't exceed the list size
      this.currentQuestion++;
    } else {
      // If you're at the end, you might want to automatically complete the quiz if that's the desired behavior
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    this.getProgressPercent();
  }

  // Method to go to the previous question
  previousQuestion() {
    if (this.currentQuestion > 0) {
      // Make sure we don't go below 0
      this.currentQuestion--;
    }
    this.getProgressPercent();

  }

  //allow user to implement this feature as needed
  abstract answer(currentQuestionNumber: number, option: any): void;

  //start counter method
  startCounter() {
    if (this.interval$) {
      this.interval$.unsubscribe(); // Ensures any previous interval is cleared
    }
    this.interval$?.unsubscribe();
    this.interval$ = interval(1000).subscribe(() => {
      this.counter--;

      if (this.counter % 60 === 0) {
        // Time for the current question is over
        if (this.currentQuestion < this.questionList.length - 1) {
          this.currentQuestion++; // Go to the next question
          this.getProgressPercent(); // Update progress percent
        } else {
          // No more questions left
          this.interval$?.unsubscribe(); // Stop the timer
        }
      }
      this.getProgressPercent(); // Adding here to make sure progress is always accurate
    });

    // Define a timeout for the entire length of the quiz
    setTimeout(() => {
      this.interval$?.unsubscribe(); // Stops the timer after all questions are over
    }, this.questionList.length * 60000); // 60 seconds per question
  }

  //stop counter
  stopCounter() {
    this.interval$?.unsubscribe(); //unsubscribe
    this.counter = 0;
  }

  //reset counter method
  resetCounter() {
    this.stopCounter(); //stop counter
    this.counter = 60; // resetting
    this.startCounter(); // start again
  }

  //method to reset quiz
  resetQuiz() {
    this.stopCounter();
    this.points = 0;
    this.currentQuestion = 0;
    this.getProgressPercent();
  }

  //method to update progress value for bar
  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
  }
}
