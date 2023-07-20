///Users/dallanmcguckian/Desktop/Visual Eye Studio/Actual project/Visual_Eye_Sim/Visual_Eye_Sim/frontend/src/app/components/pages/question/question.component.ts
import { Component, OnInit } from '@angular/core';
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
  public questionList: Question[] = []; // now type question as get from backend
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any; //for the stop clock
  progress:string="0";//to update progress bar
  isQuizCompleted:boolean=false;

  constructor(private questionsService: QuestionService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();//start counter
  }

   //method to get all questions from service
   getAllQuestions() {
    this.questionsService.getAllQuestions().subscribe((res) => {
      this.questionList = res;
    });
  }

  //create method to go to next question
  nextQuestion() {
    this.currentQuestion++;
  }

  //method to go to previous question
  previousQuestion() {
    this.currentQuestion--;
  }

  //answer method to select the answer user selects. The order of points, current question and progress methods is important as the progress bar will  not move up as expected due to the progress calculation if not in that order
  answer(currentQuestionNumber: number, option: any) {

    //check if the current question is the same as total questions
  if(currentQuestionNumber===this.questionList.length){
    this.isQuizCompleted=true;//completed quiz,show results
    this.stopCounter();//stop counter
  }
    
    if (option.correct) {
      this.points += 10; /// if they are correct give 10 points
      this.correctAnswer++; //increment correct answer
      //add delay so you can see green and red effect if answer is correct or not
      setTimeout(()=>{
        this.currentQuestion++; // go to next question
        this.resetCounter();//reset counter
        this.getProgressPercent();//call progress percent
      },1000);//1 second
     

    } else {
setTimeout(() => {
  this.currentQuestion++; // go to next question
  this.incorrectAnswer++; //increment incorrect answer
  this.resetCounter();
  this.getProgressPercent();
},1000);

     

      this.points -= 10; /// if they are incorrect remove 10 points


    }
  }

 
  //start counter method
  startCounter() {
    this.interval$ = interval(1000) // imported from rxjs, every 1 second should through a value
      .subscribe(val => {
        this.counter--;// decrement timer every one second
        //if counter reaches 0
        if (this.counter === 0) {
          this.currentQuestion++; // go to next question
          this.counter = 60; //reset to 60 seconds
          this.points -= 10; // remove 10 points
        }
      });
         //after 10 mins stop subsription
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  //stop counter
  stopCounter() {
    this.interval$.unsubscribe();//unsubscribe
    this.counter=0;
  }
  //reset counter method
  resetCounter() {
    this.stopCounter();//stop counter
    this.counter=60; // resetting
    this.startCounter(); // start again
  }

  //method to reset quiz
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0; // when reset go back to the first question
    this.progress="0";
  }

  //method to update progress value for bar
  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
