import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { QuestionService } from 'src/app/services/questions.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { UserScoreService } from 'src/app/services/userscores.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UserScore } from 'src/app/shared/models/UserScore';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  //create var to hold graph info
  public chart: any;

  //create variables to hold the casestudy information for the X axis labels
  caseStudies: CaseStudies[] = []; // add a property to hold your case studies
  labels: string[] = [];
  userScores: UserScore[]=[];
  correctCounts: number[] = [];    
  incorrectCounts: number[] = [];  

  //get constructor to retrieve necessary data
  constructor(
    private userScoreService: UserScoreService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.useCaseService.getAll().subscribe((caseStudies: CaseStudies[]) => {
      this.caseStudies = caseStudies;
      this.labels = this.caseStudies.map(
        (caseStudy) => `${caseStudy.caseStudyNumber} - ${caseStudy.name}`
      );
  
      // Initialize empty arrays to store the correct and incorrect answer counts
      this.correctCounts = [];
      this.incorrectCounts = [];
  
      // For each case study, get the user scores
      for (let caseStudy of this.caseStudies) {
        this.userScoreService.getCorrectAndIncorrectAnswers(caseStudy._id).subscribe((result) => {
          // Assuming that the result has a structure like this: { correct: number, incorrect: number }
          this.correctCounts.push(result.correct);
          this.incorrectCounts.push(result.incorrect);
  
          // Check if we've received all the responses we need
          if (this.correctCounts.length === this.caseStudies.length) {
            // All data has been fetched, now we can create the chart
            this.createChart();
          }
        });
      }
    });
  }

  createChart() {
    // Create an array to hold the correct and incorrect data for each case study
    let correctData = [];
    let incorrectData = [];
  
    // Populate the data arrays
    for (let i = 0; i < this.caseStudies.length; i++) {
      correctData.push(this.correctCounts[i]);
      incorrectData.push(this.incorrectCounts[i]);
    }
  
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels, // this will be the names of the case studies
        datasets: [
          {
            label: 'Correct',
            data: correctData,
            backgroundColor: 'limegreen', 
          },
          {
            label: 'Incorrect',
            data: incorrectData,
            backgroundColor: 'red', 
          },
        ]
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
  
  
}
