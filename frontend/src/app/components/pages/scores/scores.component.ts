import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserScoreService } from 'src/app/services/userscores.service';
import { UserScore, UserAnswer } from 'src/app/shared/models/UserScore';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
})
export class ScoresComponent implements OnInit {
  userId: string = ''; // You can get the user ID from your authentication mechanism

  userScores: UserScore[] = [];
  selectedUserScore: UserScore | null = null; // To store the selected user score details
  loading: boolean = true;

  // Mapping for user-friendly Case Study information
  caseStudyInfoMap: { [key: string]: { number: number; subject: string } } = {
    // Replace the keys ('caseStudyId') with actual case study IDs from your backend
    "64b55374f856931e2ae20b20": { number: 1, subject: 'Lizzy Bard' },
    "64b55374f856931e2ae20b27": { number: 2, subject: 'Beth Tate' },
    "64b55374f856931e2ae20b28": { number: 3, subject: 'Frank Howard' },
    // Add more case studies as needed
  };

  constructor(private userScoreService: UserScoreService, private userService: UserService) {}

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
  showDetails(userScore: UserScore) {
    this.selectedUserScore = userScore;
  }

  // Method to get user-friendly Case Study information
  getCaseStudyInfo(caseStudyId: string) {
    return this.caseStudyInfoMap[caseStudyId] || { number: -1, subject: 'Unknown' };
  }
}
