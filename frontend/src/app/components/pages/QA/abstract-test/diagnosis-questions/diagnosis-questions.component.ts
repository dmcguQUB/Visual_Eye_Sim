import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { TestService } from 'src/app/services/test.service';
import { Test, EyeAndDiagnosisAnswer } from 'src/app/shared/models/test';
import { AbstractTestComponent } from '../abstract-test.component';
import { QuestionType } from 'src/app/shared/models/question-type';
import { DIAGNOSIS_QUESTION_SCORE } from 'src/app/shared/constants/points-per-question';

@Component({
  selector: 'app-diagnosis-questions',
  templateUrl: './diagnosis-questions.component.html',
  styleUrls: ['./diagnosis-questions.component.css'],
})
export class DiagnosisQuestionsComponent
  extends AbstractTestComponent
  implements OnInit
{
  userScore?: number; // Add this property to store the fetched user score
  correctAnswer?: number = 0;
  incorrectAnswer?: number = 0;
  totalQuestions?: number = 0;
  pointsPerQuestion?: number = DIAGNOSIS_QUESTION_SCORE;
  typeOfTest: String = 'Diagnosis Test';

  //constructor with args
  constructor(
    questionsService: QuestionService,
    route: ActivatedRoute,
    userService: UserService,
    examStateService: ExamStateService,
    testService: TestService
  ) {
    //call abstract class
    super(questionsService, route, userService, examStateService, testService);
    this.questionType = QuestionType.Diagnosis; // SET Diagnosis test type
  }

  //overriide diagnosis test
  override ngOnInit() {
    // console.log('DiagnosisTestComponent initialized.');
    super.ngOnInit(); // calling the parent's ngOnInit to inherit all the logic there
  }

  // Actual implementation of the answer method
  answer(currentQuestionNumber: number, option: any) {
    // console.log(
    //   'Answer method called for question:',
    //   currentQuestionNumber,
    //   'with option:',
    //   option
    // );
    // Typecast testAnswers to EyeAndDiagnosisAnswer[]
    let answers = this.testAnswers as EyeAndDiagnosisAnswer[];

    // Store the user's answer in the eyeTestAnswers array
    if (answers[currentQuestionNumber]) {
      answers[currentQuestionNumber].questionId =
        this.questionList[currentQuestionNumber]._id;
      answers[currentQuestionNumber].answer = option.text; // Assuming option has a text property for answer text
      answers[currentQuestionNumber].correct = option.correct;
      // console.log('Data to be sent:', this.testAnswers);
    } else {
      // If not initialized, then push a new answer object
      answers.push({
        questionId: this.questionList[currentQuestionNumber]._id,
        answer: option.text,
        correct: option.correct,
      });
    }


    // Access properties directly from the parent class

    if (currentQuestionNumber === this.questionList.length - 1) {
      console.log('Quiz completed.');
      this.stopCounter();
      this.sendUserScore();
      this.isQuizCompleted = true;
    } else {
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    }
    this.getProgressPercent();
  }

  sendUserScore(): void {
    // Example
    console.log('Send user score from DiagnosisTestComponent');
    // Remove any default answers from the diagnosis array
    const cleanedDaiagnosisAnswers = this.testAnswers.filter(
      (answer) => answer.questionId !== ''
    );

    //check if user id present
    if (!this.userId) {
      console.error('userId is undefined or empty');
      return;
    }

    //create a Test data object
    const testData: Test = {
      userId: this.userId,
      caseStudyId: this.useCaseId,
      diagnosisTest: {
        score: this.points,
        answers: cleanedDaiagnosisAnswers as EyeAndDiagnosisAnswer[],
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
    this.testService.calculateScore(testId).subscribe({
      next: (res) => {
        console.log('Score calculated successfully', res);

        // After successfully calculating the score, fetch the user's score
        this.testService.fetchUserScore(this.userId, this.useCaseId).subscribe({
          next: (scoreData) => {
            console.log('Fetched user score:', scoreData);

            // Here you can use the fetched scoreData to display the user's score
            // For example, you might want to assign the score to a class property and display it in your component's template.
            // console.log(this.displayUserScore(scoreData)); // hypothetical function, you might implement it according to your UI logic.

            this.displayUserScore(scoreData); // hypothetical function, you might implement it according to your UI logic.
          },
          error: (err) => {
            console.error('Error fetching user score:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error in calculating score:', err);
      },
    });
  }

  //display user scores after sent to db, calculated scored and fetched
  displayUserScore(scoreData: Test) {
    console.log('the score data is being display', scoreData);
    this.userScore = scoreData.diagnosisTest?.score ?? 0;
    this.correctAnswer = scoreData.diagnosisTest?.correctAnswers ?? 0;
    this.totalQuestions = scoreData.diagnosisTest?.totalQuestions ?? 0;
    this.incorrectAnswer = this.totalQuestions - this.correctAnswer;
  }

  //metho to calculate the total scores
  getTotalScore(): number {
    return (this.totalQuestions || 0) * (this.pointsPerQuestion || 0);
  }
}
