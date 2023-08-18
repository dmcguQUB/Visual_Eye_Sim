import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { QuestionService } from 'src/app/services/questions.service';
import { UserService } from 'src/app/services/user.service';
import { Question } from 'src/app/shared/models/question';
import { User } from 'src/app/shared/models/User';
import { UserAnswer, UserAnswerInvestigation } from 'src/app/shared/models/UserScore';

@Component({
  selector: 'app-investigations-selection',
  templateUrl: './investigations-selection.component.html',
  styleUrls: ['./investigations-selection.component.css']
})
export class InvestigationsSelectionComponent {

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
  public isEyeExaminationTestFinished: boolean = false; // adding to change the state of the navbar to unlock investigations
  questionType: string ="investigation"

  // Add a new state variable to track loading status
public loading: boolean = true;

//allow multiple options
selectedOptions: any[] = [];

userAnswers: UserAnswer[] = [];
userInvestigationAnswers: UserAnswerInvestigation[] = [];



  constructor(private questionsService: QuestionService, private route: ActivatedRoute, private userService: UserService,  private examStateService: ExamStateService,private cdr: ChangeDetectorRef) {

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
      this.questionsService.getQuestionsByCaseStudyIdAndQuestionType(this.useCaseId, this.questionType).subscribe((res) => {
        //assign question list to response
        this.questionList = res;

        
        // Continue with the existing logic
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


  

// Method to go to the next question
nextQuestion() {
  if (this.currentQuestion < this.questionList.length - 1) { // Make sure we don't exceed the list size
      this.currentQuestion++;
  } else {
      // If you're at the end, you might want to automatically complete the quiz if that's the desired behavior
      this.isQuizCompleted = true;
      this.stopCounter();
      this.sendUserScore();
  }
}

// Method to go to the previous question
previousQuestion() {
  if (this.currentQuestion > 0) { // Make sure we don't go below 0
      this.currentQuestion--;
  }
}


  //answer method to select the answer user selects

//answer method to select the answer user selects
answer(currentQuestionNumber: number, option: any) {
  // Check if the option is already in the selectedOptions
  const index = this.selectedOptions.findIndex(o => o === option);

  if (index === -1) {
    // Not in array, add it
    this.selectedOptions.push(option);
  } else {
    // Already in array, remove it
    this.selectedOptions.splice(index, 1);
  }

  if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
  } else {
      this.incorrectAnswer++;
      this.points += 0;
  }

  // Check if you're at the end of the quiz
  if (currentQuestionNumber >= this.questionList.length) {
      this.isQuizCompleted = true;
      this.isEyeExaminationTestFinished = true;
      this.examStateService.isEyeExaminationTestFinished = true;
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




  //start counter method
  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          // Add logic here for unanswered questions
          if (!this.userAnswers[this.currentQuestion]) {
            this.userAnswers[this.currentQuestion] = {
              questionId: this.questionList[this.currentQuestion]._id, 
              userAnswer: '', 
              correct: false
            };
            this.incorrectAnswer++; // increment incorrect answer count
            this.points += 0; // no points for unanswered
        }
        

          this.currentQuestion++; // go to next question
          this.counter = 60; //reset to 60 seconds
          this.getProgressPercent(); // Update progress percent
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

 // Fetch the most recent user score
 this.questionsService.getLatestUserScore(this.userId, this.useCaseId).subscribe({
  next: (latestScore) => {
    if (latestScore) {
      this.updateUserScore(latestScore); // If there's a score, update it
    } else {
      this.createUserScore(); // If not, create a new one
    }
  },
  error: (err) => {
    console.error('Error fetching the latest user score', err);
  }
});
  
}
updateUserScore(latestScore: any) {
  const updatedScore = {
    ...latestScore,
    score: latestScore.score + this.points,
    correctAnswer: latestScore.correctAnswer + this.correctAnswer,
    incorrectAnswer: latestScore.incorrectAnswer + this.incorrectAnswer,
    answers: [...latestScore.answers, ...this.userAnswers] // or however you want to combine them
  };

  this.questionsService.updateUserScore(updatedScore).subscribe({
    next: (res) => {
      console.log('Score updated successfully', res);
    },
    error: (err) => {
      console.error('Error updating score', err);
    }
  });
}

}

