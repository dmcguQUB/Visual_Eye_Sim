// Import required dependencies and services
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { Score } from 'src/app/shared/interfaces/IScore';

@Component({
  selector: 'app-admin-avg-score-over-time',
  templateUrl: './admin-avg-score-over-time.component.html',
  styleUrls: ['./admin-avg-score-over-time.component.css'],
})
export class AdminAvgScoreOverTimeComponent implements OnInit, OnDestroy {
  // Implementing OnDestroy
  // Variables to hold the chart and data
  public chart: any;
  allResults: any[] = []; // This will hold the unfiltered results

  //required for the table below
  averageScores: number[] = [];
  correctCounts: number[] = [];
  incorrectCounts: number[] = [];
  testsCount: number[] = [];
  dateRange: number = 0; // stores the number of days in the selected date range
  labels: string[] = [];
  averageEyeTests: number[] = [];
  averageInvestigationsTests: number[] = [];
  averageDiagnosisTests: number[] = [];
  overallAveragePercentages: number[] = [];

  private subscription: Subscription = new Subscription(); // Initialize a subscription object to hold all subscriptions

  constructor(private testService: TestService) {}
  // Initialization method called when the component is loaded
  async ngOnInit(): Promise<void> {
    this.loadChartData();
  }

  loadChartData() {
    const chartDataSubscription = this.testService.getAverageTestPercentageForAllCaseStudies().subscribe(results => {
        if (results && results.scoresOverTime) {
            this.allResults = results.scoresOverTime;
            this.labels = results.scoresOverTime.map((score: { date: string; }) => score.date.split('T')[0]);
            this.averageEyeTests = results.scoresOverTime.map((score: { averageEyeTestPercentage: any; }) => score.averageEyeTestPercentage);
            this.averageInvestigationsTests = results.scoresOverTime.map((score: { averageInvestigationsTestPercentage: any; }) => score.averageInvestigationsTestPercentage);
            this.averageDiagnosisTests = results.scoresOverTime.map((score: { averageDiagnosisTestPercentage: any; }) => score.averageDiagnosisTestPercentage);
            this.overallAveragePercentages = results.scoresOverTime.map((score: { overallAveragePercentage: any; }) => score.overallAveragePercentage);
            this.testsCount = results.scoresOverTime.map((score: { testCount: any; }) => score.testCount);

            this.createChart(this.labels, this.overallAveragePercentages, this.testsCount);
        }
    });

    this.subscription.add(chartDataSubscription); // Store the subscription for later cleanup
}


  updateChartWithResults(results: any[]) {
    const labels = results.map((result) => {
      const date = new Date(result.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`;
    });

    const averages = results.map((result) => result.overallAveragePercentage);
    const userCounts = results.map((result) => result.testCount); // Adjusted to use testCount

    this.createChart(labels, averages, userCounts);
  }

  dateRangeChanged(days: number) {
    // Get the start date as a timestamp for efficient comparison
    const startTimestamp = new Date().setDate(new Date().getDate() - days);

    // Filter results where the result date is after or equal to the start date
    const filteredResults = this.allResults.filter(result => new Date(result.date).getTime() >= startTimestamp);

    // Update the chart and other properties with the filtered results
    this.updateChartWithResults(filteredResults);

    // Update the dateRange property to reflect the selected date range
    this.dateRange = days;
}


  //calculate averages required for table
  calculateAverages() {
    let avgCorrect = 0;
    let avgIncorrect = 0;

    if (this.correctCounts && this.correctCounts.length) {
      let totalAnswers =
        this.correctCounts.reduce((a, b) => a + b, 0) +
        this.incorrectCounts.reduce((a, b) => a + b, 0);
      if (totalAnswers != 0) {
        avgCorrect =
          (this.correctCounts.reduce((a, b) => a + b, 0) / totalAnswers) * 100;
      }
    }

    if (this.incorrectCounts && this.incorrectCounts.length) {
      let totalAnswers =
        this.correctCounts.reduce((a, b) => a + b, 0) +
        this.incorrectCounts.reduce((a, b) => a + b, 0);
      if (totalAnswers != 0) {
        avgIncorrect =
          (this.incorrectCounts.reduce((a, b) => a + b, 0) / totalAnswers) *
          100;
      }
    }

    return {
      avgCorrect: avgCorrect.toFixed(2),
      avgIncorrect: avgIncorrect.toFixed(2),
    };
  }

  //get average scores
  getAverageScore() {
    return (
      this.averageScores.reduce((a, b) => a + b, 0) / this.averageScores.length
    );
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
            label: 'Test Count',
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
              text: 'Test Count', // Set the right y-axis title as 'User Count'
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

  ngOnDestroy(): void { // Implement ngOnDestroy lifecycle hook
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions when component is destroyed
  }
}
