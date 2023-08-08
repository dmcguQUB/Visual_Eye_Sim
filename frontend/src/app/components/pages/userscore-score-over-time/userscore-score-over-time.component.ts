import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import 'chartjs-adapter-moment';
import { UserScoreService } from 'src/app/services/userscores.service';
import { UserService } from 'src/app/services/user.service';
import { UserScore } from 'src/app/shared/models/UserScore';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UseCaseService } from 'src/app/services/usecases.service';
import { QuestionService } from 'src/app/services/questions.service';



type ChartDataSets = { label: string; data: number[] };

@Component({
  selector: 'app-userscore-score-over-time',
  templateUrl: './userscore-score-over-time.component.html',
  styleUrls: ['./userscore-score-over-time.component.css'],
})
export class UserscoreScoreOverTimeComponent implements OnInit, AfterViewInit {
  userScores: UserScore[] = [];
  caseStudies: CaseStudies[] = []; // store all case studies here
  chartData: ChartDataSets[] = [];
  chart!: Chart;
  selectedTestCounts: { [key: string]: {start: number, end: number} } = {};
  availableTestCounts: number[] = [];  // This will be populated dynamically
  dataMap: { [key: string]: number[] } = {};  // <-- Declare it here
      // This will store the filtered scores after applying the dropdown filters
      filteredScores: UserScore[] = [];
      totalQuestionsForCaseStudies: { [key: string]: number } = {};


  @ViewChild('myChart') myChart!: ElementRef;

  //inject services into code
  constructor(
    private userScoreService: UserScoreService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService  // <-- Add this line

  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    const userId = currentUser ? currentUser._id : null;

    if (userId) {
      console.log(`User is logged in, user ID: ${userId}`);

      //get all case study information to populate graph
      this.useCaseService.getAll().subscribe((cases) => {
        this.caseStudies = cases;
        
        // Initialize selected test counts for each case study
        this.caseStudies.forEach(caseStudy => {
          this.selectedTestCounts[caseStudy._id] = { start: 1, end: 1 };

        });

        this.caseStudies.forEach(caseStudy => {
          this.questionService.getTotalQuestionsForCaseStudy(caseStudy._id).subscribe(total => {
            this.totalQuestionsForCaseStudies[caseStudy._id] = total;
          });
        });
        

        //get all user scores for specific user using userId
        this.userScoreService.getUserScores(userId).subscribe((scores) => {
          this.userScores = scores;
          this.availableTestCounts = Array.from({ length: this.userScores.length }, (_, i) => i + 1);
          this.prepareChartData();
          this.createOrUpdateChart();
        });
      });
    } else {
      console.log('No user is logged in');
    }

  }


  ngAfterViewInit(): void {
    this.updateView();

  }

  // New function to handle view updates:
  updateView(): void {
    console.log(this.selectedTestCounts);
  
    // Reset dataMap for each case study before processing
    this.caseStudies.forEach(caseStudy => {
      this.dataMap[caseStudy._id] = [];
    });
  
    this.caseStudies.forEach(caseStudy => {
      const selectedRange = this.selectedTestCounts[caseStudy._id];
      const allScoresForCaseStudy = this.userScores.filter(score => score.caseStudyId === caseStudy._id);
      
      const scoresForSelectedRange = allScoresForCaseStudy.slice(selectedRange.start - 1, selectedRange.end);
      this.dataMap[caseStudy._id] = scoresForSelectedRange.map(score => score.score);
    });
  
    // Flatten the scores from the dataMap into filteredScores
    this.filteredScores = this.userScores.filter(score => {
      const scoresForCaseStudy = this.dataMap[score.caseStudyId];
      return scoresForCaseStudy && scoresForCaseStudy.includes(score.score);
  });
  
  
    // Now, use filteredScores to prepare the chart data and update the chart
    this.prepareChartData(this.filteredScores);
    this.createOrUpdateChart();
  }
  


      // Helper methods to get the name and number for a given case study id:
      getCaseStudyName(caseStudyId: string): string {
        const caseStudy = this.caseStudies.find(cs => cs._id === caseStudyId);
        return caseStudy ? caseStudy.name : '';
    }

    getCaseStudyNumber(caseStudyId: string): number {
        const caseStudy = this.caseStudies.find(cs => cs._id === caseStudyId);
        return caseStudy ? caseStudy.caseStudyNumber : 0;
    }

    
  
  
 // This method is responsible for creating and updating the chart.
private createOrUpdateChart(): void {
  // If a chart already exists, destroy it to avoid overlap.
  if (!this.chart) {
  // Create a new Chart instance.
  this.chart = new Chart<'line', number[], unknown>(
      // Attach the chart to the native HTML element referenced by 'myChart'.
      this.myChart.nativeElement,
      {
          // Define the type of the chart as a line chart.
          type: 'line',
          
          // Data properties for the chart.
          data: {
              // Use the user scores' indices (incremented by 1) as X-axis data.
              labels: this.userScores.map((score, index) => index + 1),
              
              // Y-axis data and properties for datasets (lines).
              datasets: this.chartData,
          },
          
          // Additional configuration options for the chart.
          options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tests'
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Score (%)'
                    },
                    ticks: {
                        callback: function(tickValue: string | number) {
                            return tickValue + '%';
                        },
                        stepSize: 10
                    }
                }
            }
        }
        
      }
  );
} else {
  this.chart.data.labels = this.userScores.map((score, index) => index + 1);
  this.chart.data.datasets = this.chartData;
  this.chart.update(); // Use the update method to redraw the chart.
}}

getScoresForCaseStudy(caseStudyId: string): UserScore[] {
  return this.filteredScores.filter(score => score.caseStudyId === caseStudyId);
}

private prepareChartData(filteredScores: UserScore[] = this.userScores): void {
  // Clear the previous chart data
  this.chartData = [];

  // Create a case studies map
  const caseStudiesMap: { [key: string]: CaseStudies } = {};
  this.caseStudies.forEach((caseStudy) => {
    caseStudiesMap[caseStudy._id] = caseStudy;
  });

  // Adjusted: Now, dataMap has already been filled from updateView()
  // You don't need to re-create it here. Just build the chart data

  for (const caseStudyId in this.dataMap) {
    const label = caseStudiesMap[caseStudyId]
      ? `${caseStudiesMap[caseStudyId].caseStudyNumber} - ${caseStudiesMap[caseStudyId].name}`
      : caseStudyId;
  
    // Convert scores to percentages
    const percentageData = this.dataMap[caseStudyId].map(score => {
      const dummyScore: Partial<UserScore> = { score: score, caseStudyId: caseStudyId }; // Use Partial to make properties optional
      return this.getPercentageCorrect(dummyScore as UserScore); // Cast it back to UserScore when passing to getPercentageCorrect
    });
  
    this.chartData.push({
      label: label,
      data: percentageData,
    });
  }
  
}


// Assuming you have a total number of questions for each score to calculate the percentage. 
getPercentageCorrect(score: UserScore): number {
  const totalQuestions = this.totalQuestionsForCaseStudies[score.caseStudyId] || 100;  // Default to 100 if not found
  return (score.score / totalQuestions) * 10;
}


}
