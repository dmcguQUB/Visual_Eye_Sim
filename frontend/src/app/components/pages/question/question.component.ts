import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { Question } from 'src/app/shared/models/question';
import { User } from 'src/app/shared/models/User';
import { UserAnswer } from 'src/app/shared/models/UserScore';

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
  questionText: string ='';
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any; //for the stop clock
  progress: string = "0"; //to update progress bar
  isQuizCompleted: boolean = false;
  useCaseId: any = "";
  currentUser:User= new User();
  userId: string ="";
  // Add this line to store userId

  // Add a new state variable to track loading status
public loading: boolean = true;
  


  constructor(private questionsService: QuestionService, private route: ActivatedRoute, private userService: UserService) {

   }
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId');
    this.getQuestionsForUseCase();
    this.startCounter(); //start counter
    this.userService.userObservable.subscribe(user => {
      this.currentUser = user;
      if (user && user._id) { // Check if _id is defined
        this.userId = user._id; // get userId from UserService
        console.log(this.userId); // to check if userId is getting assigned correctly
      } else {
        console.error('userId is undefined');
      }
    });


  }

  getQuestionsForUseCase() {
    console.log("This is case study from question component" + this.useCaseId);
    if (this.useCaseId) {
      this.questionsService.getQuestionsByCaseStudyId(this.useCaseId).subscribe((res) => {
        this.questionList = res;

        // Initialize userAnswers now that we have the questions
        this.questionList.forEach(() => this.userAnswers.push({
          questionId: '', 
          userAnswer: '', 
          correct: false,
        }));
             // Set loading to false now that we have the data
      this.loading = false;
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
 // Add a new property to keep track of user's answers
userAnswers: UserAnswer[] = [];

//answer method to select the answer user selects
answer(currentQuestionNumber: number, option: any) {

  // If the user has not selected an answer for the current question, add a default answer
  if (!this.userAnswers[currentQuestionNumber]) {
   this.userAnswers[currentQuestionNumber] = {
     questionId: '', 
     userAnswer: '', 
     correct: false,
   };
 }

 // Track the user's answer
 this.userAnswers[currentQuestionNumber] = {
   questionId: this.questionList[this.currentQuestion]._id, // Replace with the actual question ID property
   userAnswer: option.text, // Replace with the actual user's answer property
   correct: option.correct,
 };

 if (currentQuestionNumber === this.questionList.length) {
   this.isQuizCompleted = true; //completed quiz, show results
   this.stopCounter(); //stop counter
   this.sendUserScore(); // Send the user's score to backend when the quiz is completed
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
   this.points +=0; // if they are incorrect they get 0
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
          this.points = 0; // remove 10 points
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

 // This method will send the user's score to backend
// Modify the sendUserScore method to send the userAnswers and testTakenAt
sendUserScore() {

   // Remove any default answers from the userAnswers array
   const cleanedUserAnswers = this.userAnswers.filter(answer => answer.questionId !== '');
  if (!this.userId) {
    console.error('userId is undefined or empty');
    return;
  }
  const userScore = {
    userId: this.userId, 
    caseStudyId: this.useCaseId,
    score: this.points,
    correctAnswer: this.correctAnswer,
    incorrectAnswer: this.incorrectAnswer,
    answers: cleanedUserAnswers, // send the cleaned userAnswers array without default values
    testTakenAt: new Date() // send the current date and time
  };

  this.questionsService.postUserScore(userScore).subscribe({
    next: (res) => {
      console.log('Score sent successfully', res);
    },
    error: (err) => {
      console.error('Error in sending score', err);
    }
  });
  
}

}


