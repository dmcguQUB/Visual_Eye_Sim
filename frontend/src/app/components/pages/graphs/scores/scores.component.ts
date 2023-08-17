import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/questions.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { UserScoreService } from 'src/app/services/userscores.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Question } from 'src/app/shared/models/question';
import { UserScore, UserAnswer } from 'src/app/shared/models/UserScore';
import { Chart, ChartConfiguration, PieController, Title, Tooltip, ArcElement, CategoryScale } from 'chart.js';

Chart.register(PieController, Title, Tooltip, ArcElement, CategoryScale);

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],

})
export class ScoresComponent implements OnInit {
  userId: string = ''; // You can get the user ID from your authentication mechanism
  question: Question = new Question();
  userScoreCaseStudy: CaseStudies = new CaseStudies();
  userScores: UserScore[] = [];
  selectedUserScore: UserScore = {
    // Initialize properties here
    userId:'',
    caseStudyId: '',
    score: 0,
    testTakenAt: new Date(),
    answers: [],
    questions: [], // Initialize the questions property
  };
  loading: boolean = true;
    // Add this new property to control the visibility of the detailed information section
    showDetailsSection: boolean = false;
    totalNumberOfQuestions: number =0; // get total number of question used to calculate percentage
    scorePerQuestion:number=10;//assign questions per question
    totalScorePerTest:number=0;//number of points available per question used to calculate percentage correct
     // Declare the variable i to be used in the template
  i: number = 0;
  scoreChart?: Chart;//for chart


  constructor(
    private userScoreService: UserScoreService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.fetchUserScores();
    
  }

  fetchUserScores() {
    // Check if currentUser is defined and has a valid _id property
    if (this.userService.currentUser && this.userService.currentUser._id) {
      this.userId = this.userService.currentUser._id;
      this.loading = true;
      this.userScoreService.getUserScores(this.userId).subscribe(
        (userScores) => {
          this.userScores = userScores;
          this.loading = false;

          // Fetch case study details for each user score
          this.fetchCaseStudyDetails();
        },
        (error) => {
          console.error('Error fetching user scores:', error);
          this.loading = false;
        }
      );
    } else {
      console.error('User ID is undefined or invalid.');
      this.loading = false;
    }
  }

// Method to show more details about a specific user score
async showDetails(selectedUserScore: UserScore) {
  this.selectedUserScore = selectedUserScore;
  this.selectedUserScore.questions = []; // Initialize the questions property
  this.showDetailsSection = true; // Show the detailed information section
  
  await this.fetchQuestionDetails(); // Fetch questions after setting the selectedUserScore
  this.createScoreChart(); // Create the pie chart
}


  fetchCaseStudyDetails() {
    // Iterate through userScores and fetch case study details for each user score
    for (const userScore of this.userScores) {
      this.useCaseService.getUseCaseById(userScore.caseStudyId).subscribe(
        (caseStudy) => {
          // Update the userScore object with case study details
          userScore.caseStudy = caseStudy;
        },
        (error) => {
          console.error('Error fetching case study details:', error);
        }
      );
    }
  }
  

  // get the question details for a specific question ID
// Change fetchQuestionDetails to return a Promise
fetchQuestionDetails(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedUserScore) {
      console.error('No user score is selected.');
      reject('No user score is selected.');
      return;
    }

    const caseStudyId = this.selectedUserScore.caseStudyId;
    console.log("case study number"+caseStudyId);
    this.questionService.getQuestionsByCaseStudyId(caseStudyId).subscribe(
      (questions) => {
        // Update the selectedUserScore with the fetched questions
        this.selectedUserScore.questions = questions;
        //assign the total number of questions from questions length
        this.totalNumberOfQuestions= this.selectedUserScore.questions.length;

        //calculate the number of available points
        this.totalScorePerTest = this.totalNumberOfQuestions * this.scorePerQuestion;

        resolve(questions);
      },
      (error) => {
        console.error('Error fetching questions:', error);
        reject(error);
      }
    );
  });
}


  // Helper method to find the user answer for a specific question
  getAnswerForQuestion(questionId: string): UserAnswer | undefined {
    if (!this.selectedUserScore || !this.selectedUserScore.answers) {
      return undefined;
    }

    return this.selectedUserScore.answers.find(
      (answer) => answer.questionId === questionId
    );
  }

//get the number of questions per userScore
  getNumberOfQuestions(userScore: UserScore): number {
    if (!userScore || !userScore.questions) {
      return 0;
    }
    return userScore.questions.length;
  }

  //find correct answer 
  getCorrectAnswer(question: Question): string {
    const correctOption = question.options.find((option) => option.correct);
    return correctOption ? correctOption.text : 'N/A';
  }
  
   // Method for creating pie chart
  createScoreChart() {
    // Destroy the existing chart if it exists to ensure that a new chart is created each time
    if (this.scoreChart) {
      this.scoreChart.destroy();
    }

    const totalScore = this.getNumberOfQuestions(this.selectedUserScore) * this.scorePerQuestion;
    const score = this.selectedUserScore.score;
    const correctPercentage = (score/totalScore)*100;
    const incorrectScore = totalScore - score;
    const incorrectPercentage = (incorrectScore/totalScore)*100;


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
