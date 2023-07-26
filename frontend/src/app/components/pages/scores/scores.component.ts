import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/questions.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { UserScoreService } from 'src/app/services/userscores.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Question } from 'src/app/shared/models/question';
import { UserScore, UserAnswer } from 'src/app/shared/models/UserScore';

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
  showDetails(selectedUserScore: UserScore) {
    this.selectedUserScore = selectedUserScore;
    this.selectedUserScore.questions = []; // Initialize the questions property
    this.fetchQuestionDetails();
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
  // Update the fetchQuestionDetails() method
  fetchQuestionDetails() {
    if (!this.selectedUserScore) {
      console.error('No user score is selected.');
      return;
    }

    const caseStudyId = this.selectedUserScore.caseStudyId;
    this.questionService.getQuestionsByCaseStudyId(caseStudyId).subscribe(
      (questions) => {
        // Update the selectedUserScore with the fetched questions
        this.selectedUserScore.questions = questions;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
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
}
