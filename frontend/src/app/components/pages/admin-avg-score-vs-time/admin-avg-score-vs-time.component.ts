// Import required dependencies and services
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserScoreService } from 'src/app/services/userscores.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-admin-avg-score-vs-time',
  templateUrl: './admin-avg-score-vs-time.component.html',
  styleUrls: ['./admin-avg-score-vs-time.component.css'],
})
export class AdminAvgScoreVsTimeComponent implements OnInit {
  // Variables to hold the chart and data
  public chart: any;
  caseStudies: CaseStudies[] = [];
  selectedCaseStudy: CaseStudies | null = null;
  allResults: any[] = []; // This will hold the unfiltered results

  //required for the table below
  averageScores: number[] = [];
  correctCounts: number[] = [];
  incorrectCounts: number[] = [];
  testsCount: number[] = [];
  dateRange: number = 0; // stores the number of days in the selected date range
  labels?: any[];  // use appropriate type instead of 'any'

  constructor(
    private userScoreService: UserScoreService,
    private useCaseService: UseCaseService
  ) {}
  // Initialization method called when the component is loaded
  async ngOnInit(): Promise<void> {
    // Retrieve all case studies from the UseCaseService using await to handle the asynchronous nature
    const caseStudies = await this.useCaseService.getAll().toPromise();
    this.caseStudies = caseStudies ? caseStudies : [];

    // If there are case studies, select the first one by default
    if (this.caseStudies.length > 0) {
      this.selectedCaseStudy = this.caseStudies[0];
      // Load chart data for the selected case study
      this.loadChartData(this.selectedCaseStudy._id);
    }
  }

  // Event handler for the case study selection change
  onCaseStudyChange(caseStudy: CaseStudies | null) {
    if (caseStudy) {
      // When a case study is selected, store it in the selectedCaseStudy variable
      this.selectedCaseStudy = caseStudy;
      // Load chart data for the selected case study
      this.loadChartData(caseStudy._id);
    }
  }

  async loadChartData(caseStudyId: string) {
    // Retrieve the average scores over time for the selected case study from the UserScoreService using await to handle the asynchronous nature
    const results = await this.userScoreService
      .getAverageScoresOverTimePerCaseStudy(caseStudyId)
      .toPromise();
  
    const answerCounts = await this.userScoreService
      .getCorrectAndIncorrectAnswers(caseStudyId)
      .toPromise();
  
    if (results && answerCounts) { // Check if both results and answerCounts are defined
      // Store the complete data set in allResults
      this.allResults = results;
      
      // Extract the necessary data from the results
      const labels = results.map((result) => {
        const date = new Date(result.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`;
      });
  
      this.averageScores = results.map((result) => result.averageScore);
      this.correctCounts = Array(results.length).fill(answerCounts.correct);  // Fill with the correct count fetched
      this.incorrectCounts = Array(results.length).fill(answerCounts.incorrect); // Fill with the incorrect count fetched
      this.testsCount = results.map((result) => result.userCount);
  
      // Create the chart using the extracted data
      this.createChart(labels, this.averageScores, this.testsCount);
    }
  }
  
  
  

  updateChartWithResults(results: any[]) {
    const labels = results.map((result) => {
      const date = new Date(result.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`;
    });

    const averages = results.map((result) => result.averageScore);
    const userCounts = results.map((result) => result.userCount);

    this.createChart(labels, averages, userCounts);
  }

  dateRangeChanged(days: number) {
    // Create a date object representing the start date of the range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Filter the results based on the selected date range
    const filteredResults = this.allResults.filter((result) => {
      const resultDate = new Date(result.date);
      return resultDate >= startDate;
    });

    
    // update properties with filtered results
    this.averageScores = filteredResults.map((result) => result.averageScore);
    this.correctCounts = filteredResults.map((result) => result.correctCount);
    this.incorrectCounts = filteredResults.map(
      (result) => result.incorrectCount
    );
    this.testsCount = filteredResults.map((result) => result.userCount);

    this.updateChartWithResults(filteredResults);
    this.dateRange = days; // update the dateRange property
  }

  //calculate averages required for table
calculateAverages() {
  let avgCorrect = 0;
  let avgIncorrect = 0;

  if (this.correctCounts && this.correctCounts.length) {
    let totalAnswers = this.correctCounts.reduce((a, b) => a + b, 0) + this.incorrectCounts.reduce((a, b) => a + b, 0);
    if (totalAnswers != 0) {
      avgCorrect = (this.correctCounts.reduce((a, b) => a + b, 0) / totalAnswers) * 100;
    }
  }

  if (this.incorrectCounts && this.incorrectCounts.length) {
    let totalAnswers = this.correctCounts.reduce((a, b) => a + b, 0) + this.incorrectCounts.reduce((a, b) => a + b, 0);
    if (totalAnswers != 0) {
      avgIncorrect = (this.incorrectCounts.reduce((a, b) => a + b, 0) / totalAnswers) * 100;
    }
  }

  return {
    avgCorrect: avgCorrect.toFixed(2),
    avgIncorrect: avgIncorrect.toFixed(2),
  };
}

  

  //get average scores
  getAverageScore() {
    return this.averageScores.reduce((a, b) => a + b, 0) / this.averageScores.length;
}

  //calculate number of tests for table
  totalTests() {
    return this.testsCount.reduce((a, b) => a + b, 0);
  }

  // Method to create and update the chart with the provided data
  createChart(labels: string[], averages: number[], userCounts: number[]) {
    // Destroy the existing chart if it exists to avoid duplicate rendering
    if (this.chart) {
      this.chart.destroy();
    }

    // Create a new chart using Chart.js library
    this.chart = new Chart('MyChart', {
      type: 'bar', // Set the global chart type as bar
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Average Score',
            data: averages,
            type: 'line', // Override the global chart type for this dataset to be a line
            borderColor: 'blue',
            fill: false,
            yAxisID: 'y-axis-1', // Associate this dataset with the left y-axis
          },
          {
            label: 'User Count',
            data: userCounts,
            borderColor: 'green',
            backgroundColor: 'lightgreen',
            yAxisID: 'y-axis-2', // Associate this dataset with the right y-axis
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date', // Set the x-axis title as 'Date'
            },
          },
          'y-axis-1': {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Score (%)', // Set the left y-axis title as 'Average Score (%)'
            },
          },
          'y-axis-2': {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'User Count', // Set the right y-axis title as 'User Count'
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              stepSize: 1, // Set the step size for y-axis ticks to 1
              precision: 0, // Set the precision for y-axis ticks to 0 (no decimal places)
            },
          },
        },
      },
    });
  }
}
