import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { TestService } from 'src/app/services/test.service';
import { Test, EyeAndDiagnosisAnswer } from 'src/app/shared/models/test';
import { AbstractTestComponent } from '../abstract-test.component';
import { QuestionType } from 'src/app/shared/models/question-type';


@Component({
  selector: 'app-eye-test-questions',
  templateUrl: './eye-test-questions.component.html',
  styleUrls: ['./eye-test-questions.component.css']
})
export class EyeTestQuestionsComponent extends AbstractTestComponent implements OnInit {

  constructor(
    questionsService: QuestionService, 
    route: ActivatedRoute, 
    userService: UserService,  
    examStateService: ExamStateService,
    testService: TestService  
  ) {
    super(questionsService, route, userService, examStateService, testService);
    this.questionType = QuestionType.EyeTest;
  }
  

  override ngOnInit() {
    console.log("EyeTestQuestionsComponent initialized.");
    super.ngOnInit(); // calling the parent's ngOnInit to inherit all the logic there
  }

  // Actual implementation of the answer method
  answer(currentQuestionNumber: number, option: any) {
    console.log("Answer method called for question:", currentQuestionNumber, "with option:", option);
      // Typecast testAnswers to EyeAndDiagnosisAnswer[]
      let answers = this.testAnswers as EyeAndDiagnosisAnswer[];
    
      // Store the user's answer in the eyeTestAnswers array
      if (answers[currentQuestionNumber]) {
          answers[currentQuestionNumber].questionId = this.questionList[currentQuestionNumber]._id;
          answers[currentQuestionNumber].answer = option.text; // Assuming option has a text property for answer text
          answers[currentQuestionNumber].correct = option.correct;
          console.log("Data to be sent:", this.testAnswers);
      } else {
          // If not initialized, then push a new answer object
          answers.push({
              questionId: this.questionList[currentQuestionNumber]._id,
              answer: option.text, 
              correct: option.correct
          });
      }
  
    // Update the score if the answer is correct
    if (option.correct) {
        this.points += 10;
        this.correctAnswer++;
    } else {
        this.incorrectAnswer++;
    }
  
     // Access properties directly from the parent class
     if (currentQuestionNumber === this.questionList.length - 1) {
      console.log("Quiz completed.");
      this.isQuizCompleted = true;
      this.stopCounter();
      this.sendUserScore();
  } else {
      setTimeout(() => {
          this.currentQuestion++;
          this.resetCounter();
          this.getProgressPercent();
      }, 1000);
  }
  
  }

  // Actual implementation of the sendUserScore method
  sendUserScore(): void {
    // Example
    console.log("Send user score from EyeTestQuestionsComponent");
 // Remove any default answers from the eyeTestAnswers array
 const cleanedEyeTestAnswers = this.testAnswers.filter(answer => answer.questionId !== '');

 if (!this.userId) {
     console.error('userId is undefined or empty');
     return;
 }

 const testData: Test = {
     userId: this.userId,
     caseStudyId: this.useCaseId,
     eyeTest: {
         score: this.points,
         answers: cleanedEyeTestAnswers
     }
 };

 this.testService.submitTestData(testData).subscribe({
     next: (res) => {
         console.log('Score sent successfully', res);
     },
     error: (err) => {
         console.error('Error in sending score', err);
     }
 });
  }

}