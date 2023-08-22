import { Component, OnInit, OnDestroy } from '@angular/core'; // Imported OnDestroy
import { ActivatedRoute } from '@angular/router';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { TestService } from 'src/app/services/test.service';
import { Test, InvestigationsAnswer } from 'src/app/shared/models/test';
import { AbstractTestComponent } from '../abstract-test.component';
import { QuestionType } from 'src/app/shared/models/question-type';
import { Observable, Subscription, switchMap } from 'rxjs'; // Imported Subscription
import { INVESTIGATION_QUESTION_SCORE } from 'src/app/shared/constants/points-per-question';

@Component({
  selector: 'app-investigations-questions',
  templateUrl: './investigations-questions.component.html',
  styleUrls: ['./investigations-questions.component.css'],
})
export class InvestigationsQuestionsComponent
  extends AbstractTestComponent
  implements OnInit, OnDestroy
{
  // Implemented OnDestroy

  //selected answers
  userScore?: number; // Add this property to store the fetched user score
  correctAnswer?: number = 0;
  incorrectAnswer?: number = 0;
  totalQuestions?: number = 0;
  pointsPerQuestion?: number = INVESTIGATION_QUESTION_SCORE;
  typeOfTest: String = 'Investigations Test';
  isInvestigationsTestFinished: boolean = false;
  selectedAnswers: string[] = [];
  totalScore: number = 0;
  // Added a subscription collection
  private subscriptions: Subscription[] = [];

  //constructor with args
  constructor(
    questionsService: QuestionService,
    route: ActivatedRoute,
    userService: UserService,
    examStateService: ExamStateService,
    testService: TestService
  ) {
    //call abstract class constructor
    super(questionsService, route, userService, examStateService, testService);
    this.questionType = QuestionType.Investigations;
  }

  override ngOnInit() {
    // console.log('Investigations QuestionsComponent initialized.');
    super.ngOnInit(); // calling the parent's ngOnInit to inherit all the logic there
    // Once the results are loaded successfully, set the state to true

    //just adding this for now but will update. Should be called onced test complete
    // Use a Subscription to manage the observable and prevent memory leaks
    const sub = this.examStateService.isInvestigationsTestFinished$.subscribe(
      (isFinished) => {
        this.isInvestigationsTestFinished = isFinished;
      }
    );

    this.subscriptions.push(sub); // Added to the subscription collection
  }

  override ngOnDestroy(): void {
    // OnDestroy lifecycle hook to unsubscribe from observables
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Actual implementation of the answer method
  answer(currentQuestionNumber: number) {
    let answers = this.testAnswers as InvestigationsAnswer[];

    if (answers[currentQuestionNumber]) {
      answers[currentQuestionNumber].questionId =
        this.questionList[currentQuestionNumber]._id;
      answers[currentQuestionNumber].userAnswers = [...this.selectedAnswers];
    } else {
      answers.push({
        questionId: this.questionList[currentQuestionNumber]._id,
        userAnswers: [...this.selectedAnswers],
        correctAnswers: [], // Set this based on your logic.
      });
    }

    this.selectedAnswers = []; // Clear the current selected answers.

    this.nextQuestion(); // Move to the next question or end the test if it's the last question.
  }

  override nextQuestion(): void {
    if (this.currentQuestion === this.questionList.length - 1) {
      console.log('Quiz completed.');
      this.updateTotalScore(); // Fetch and set the total score when the component initializes.
      this.stopCounter();
      this.sendUserAnswers();
      this.isQuizCompleted = true;
    } else {
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    }
  }

  // Actual implementation of the sendUserScore method
  sendUserAnswers(): void {
    console.log('Send user answers from InvestigationsQuestionsComponent');

    const cleanedInvestigationsAnswers = this.testAnswers.filter(
      (answer) => answer.questionId !== ''
    );

    //check if user id present
    if (!this.userId) {
      console.error('userId is undefined or empty');
      return;
    }

    const testData: Test = {
      userId: this.userId,
      caseStudyId: this.useCaseId,
      investigationsTest: {
        score: 0, // This score will be computed by the backend.
        answers: cleanedInvestigationsAnswers as InvestigationsAnswer[],
      },
    };

    //call the test service to submit the test info
    this.testService.submitTestData(testData).subscribe({
      //when scores sent calculate the scores in the backend using API endpoint
      next: (res) => {
        //check if scores sucessfully sent
        console.log('Score sent successfully', res);

        //check if the response test data has test object and test._id to locate the object to update (i.e. most recent)
        if (res && res.test._id) {
          //if true, then call function to calculate the scores in backend and show to user for results
          this.calculateAndFetchUserScore(res.test._id);
        } else {
          console.error('Failed to obtain test ID from the response.');
        }
      },
      error: (err) => {
        console.error('Error in sending score', err);
      },
    });
  }

  // New method to calculate and fetch user score
  calculateAndFetchUserScore(testId: string): void {
    //flatter method
    this.testService
      .calculateScore(testId)
      .pipe(
        switchMap(() => {
          return this.testService.fetchUserScore(this.userId, this.useCaseId);
        })
      )
      .subscribe({
        next: (scoreData) => {
          console.log('Fetched user score:', scoreData);
          this.displayUserScore(scoreData);
        },
        error: (err) => {
          console.error('Error in calculating or fetching user score:', err);
        },
      });
  }

  //display user scores after sent to db, calculated scored and fetched
  displayUserScore(scoreData: Test) {
    console.log('the score data is being display', scoreData);
    this.userScore = scoreData.investigationsTest?.score ?? 0;
    this.correctAnswer = scoreData.investigationsTest?.correctAnswers ?? 0;
    this.totalQuestions = scoreData.investigationsTest?.totalQuestions ?? 0;
    this.incorrectAnswer = this.totalQuestions - this.correctAnswer;
  }
  updateTotalScore(): void {
    this.getTotalScore().subscribe(
      (score) => {
        console.log('Total Score:', score);
        this.totalScore = score; //assign value to score total
      },
      (error) => {
        console.error('Error fetching total score:', error);
      }
    );
  }
  getTotalScore(): Observable<number> {
    return new Observable((observer) => {
      let totalScore = 0;

      console.log('Use Case ID:', this.useCaseId);
      console.log('Question Type:', this.questionType);

      if (this.useCaseId && this.questionType) {
        this.questionsService
          .getCorrectAnswersByCaseStudyIdAndQuestionType(
            this.useCaseId,
            this.questionType
          )
          .subscribe(
            (correctAnswers) => {
              console.log('Received correct answers:', correctAnswers);

              correctAnswers.forEach((answer) => {
                totalScore +=
                  (answer.correctOptions.length || 0) *
                  (this.pointsPerQuestion || 0);
              });
              observer.next(totalScore);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      } else {
        observer.next(totalScore); // just send the total score if conditions aren't met
        observer.complete();
      }
    });
  }

  //
  toggleAnswer(currentQuestionNumber: number, option: any) {
    if (this.selectedAnswers.includes(option.text)) {
      const index = this.selectedAnswers.indexOf(option.text);
      this.selectedAnswers.splice(index, 1);
    } else {
      this.selectedAnswers.push(option.text);
    }
  }

  isSelected(option: any): boolean {
    return this.selectedAnswers.includes(option.text);
  }
}
