import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { QuestionService } from 'src/app/services/questions.service';
import { Question } from 'src/app/shared/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList: Question[] = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any; //for the stop clock
  progress: string = "0"; //to update progress bar
  isQuizCompleted: boolean = false;
  useCaseId: any = "";

  constructor(private questionsService: QuestionService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
    this.getQuestionsForUseCase();
    this.startCounter(); //start counter
  }

  getQuestionsForUseCase() {
    console.log("This is case study from question component"+this.useCaseId)
    if (this.useCaseId) {
      this.questionsService.getQuestionsByCaseStudyId(this.useCaseId).subscribe((res) => {
        this.questionList = res;
      }, (err) => {
        console.error(err);
      });
    } else {
      console.error('useCaseId is null');
    }
  }

  //create method to go to next question
  nextQuestion() {
    this.currentQuestion++;
  }

  //method to go to previous question
  previousQuestion() {
    this.currentQuestion--;
  }

  //answer method to select the answer user selects
  answer(currentQuestionNumber: number, option: any) {
    if (currentQuestionNumber === this.questionList.length) {
      this.isQuizCompleted = true; //completed quiz, show results
      this.stopCounter(); //stop counter
    }

    if (option.correct) {
      this.points += 10; // if they are correct give 10 points
      this.correctAnswer++; //increment correct answer
      setTimeout(() => {
        this.currentQuestion++; // go to next question
        this.resetCounter(); //reset counter
        this.getProgressPercent(); //call progress percent
      }, 1000); //1 second
    } else {
      setTimeout(() => {
        this.currentQuestion++; // go to next question
        this.incorrectAnswer++; //increment incorrect answer
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points -= 10; // if they are incorrect remove 10 points
    }
  }

  //start counter method
  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          this.currentQuestion++; // go to next question
          this.counter = 60; //reset to 60 seconds
          this.points -= 10; // remove 10 points
        }
      });

    //after 10 mins stop subscription
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  //stop counter
  stopCounter() {
    this.interval$.unsubscribe(); //unsubscribe
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
    this.resetCounter();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0; // when reset go back to the first question
    this.progress = "0";
    this.getQuestionsForUseCase(); // load questions again when reset
  }

  //method to update progress value for bar
  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }
}
