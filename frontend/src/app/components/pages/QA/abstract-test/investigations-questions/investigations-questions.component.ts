import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { TestService } from 'src/app/services/test.service';
import { Test, InvestigationsAnswer } from 'src/app/shared/models/test';
import { AbstractTestComponent } from '../abstract-test.component';
import { QuestionType } from 'src/app/shared/models/question-type';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-investigations-questions',
  templateUrl: './investigations-questions.component.html',
  styleUrls: ['./investigations-questions.component.css'],
})
export class InvestigationsQuestionsComponent
  extends AbstractTestComponent
  implements OnInit
{
  //selected answers
  selectedAnswers: string[] = [];
  userScore$: Observable<number> = of(0);

  constructor(
    questionsService: QuestionService,
    route: ActivatedRoute,
    userService: UserService,
    examStateService: ExamStateService,
    testService: TestService
  ) {
    super(questionsService, route, userService, examStateService, testService);
    this.questionType = QuestionType.Investigations;
  }

  override ngOnInit() {
    console.log('Investigations QuestionsComponent initialized.');
    super.ngOnInit(); // calling the parent's ngOnInit to inherit all the logic there
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

  investigationScore: number | null = null;

  override nextQuestion(): void {
    if (this.currentQuestion < this.questionList.length - 1) {
      this.currentQuestion++;
    } else {
      this.isQuizCompleted = true;
      this.stopCounter();
      this.sendUserAnswers(); // Call this to send answers once the quiz is done
    }
  }

  // Actual implementation of the sendUserScore method
  sendUserAnswers(): void {
    console.log('Send user answers from InvestigationsQuestionsComponent');

    const cleanedInvestigationsAnswers = this.testAnswers.filter(
      (answer) => answer.questionId !== ''
    );

    if (!this.userId) {
      console.error('userId is undefined or empty');
      return;
    }

    const testData: Test = {
      userId: this.userId,
      caseStudyId: this.useCaseId,
      investigationsTest: {
        score: 0, // This score will be computed by the backend.
        answers: cleanedInvestigationsAnswers,
      },
    };

    this.testService.submitTestData(testData).subscribe({
      next: (res) => {
        console.log('Answers sent successfully', res);
        this.fetchUserScore(); // Call this to fetch the user score after successfully sending the answers
      },
      error: (err) => {
        console.error('Error in sending answers', err);
      },
    });
  }

  fetchUserScore(): void {
    if (!this.userId || !this.useCaseId) {
      console.error('userId or useCaseId is undefined or empty');
      return;
    }

    this.testService.fetchUserScore(this.userId, this.useCaseId).subscribe({
      next: (res) => {
        console.log('User score fetched successfully', res);
        this.userScore$ = of(res.investigationsTest?.score || 0);  // Wrap the score in an observable
      },
      error: (err) => {
        console.error('Error in fetching user score', err);
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