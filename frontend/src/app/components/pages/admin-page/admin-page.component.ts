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
    this.correctCounts = Array(this.caseStudies.length).fill(0);
    this.incorrectCounts = Array(this.caseStudies.length).fill(0);

    // Create an array to hold promises
    let promises = <any>[];

    // For each case study, get the user scores
    this.caseStudies.forEach((caseStudy, index) => {
      let promise = this.userScoreService.getCorrectAndIncorrectAnswers(caseStudy._id).toPromise();
      promises.push(promise);
      promise.then((result:any) => {
        // Assuming that the result has a structure like this: { correct: number, incorrect: number }
        this.correctCounts[index] = result.correct;
        this.incorrectCounts[index] = result.incorrect;
      });
    });

    // Wait for all promises to resolve before creating the chart
    Promise.all(promises).then(() => {
      this.createChart();
    });
  });
}



  createChart() {
    // Create an array to hold the correct and incorrect data for each case study
    let correctDataPercentages = [];
    let incorrectDataPercentages = [];
  
    // Populate the data arrays
    for (let i = 0; i < this.caseStudies.length; i++) {
      let total = this.correctCounts[i] + this.incorrectCounts[i];

      correctDataPercentages.push((this.correctCounts[i] / total) * 100);
      incorrectDataPercentages.push((this.incorrectCounts[i] / total) * 100);
    }
  
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels, // this will be the names of the case studies
        datasets: [
          {
            label: 'Correct',
            data: correctDataPercentages,
            backgroundColor: 'limegreen', 
          },
          {
            label: 'Incorrect',
            data: incorrectDataPercentages,
            backgroundColor: 'red', 
          },
        ]
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              // Include a % sign in the ticks
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      },
    });
  }

  
  
}
