import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { QuestionService } from 'src/app/services/questions.service';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Test } from 'src/app/shared/models/test';

type ChartDataSets = { label: string; data: number[] };
@Component({
  selector: 'app-user-scores-over-time-graph',
  templateUrl: './user-scores-over-time-graph.component.html',
  styleUrls: ['./user-scores-over-time-graph.component.css'],
})
export class UserScoresOverTimeGraphComponent {
  caseStudies: CaseStudies[] = []; // store all case studies here
  chartData: ChartDataSets[] = [];
  chart!: Chart;
  availableTestCounts: { [key: string]: number[] } = {};
  dataMap: { [key: string]: number[] } = {}; // <-- Declare it here
  testScores: Test[] = []; // to store all test scores fetched
  totalQuestionsForCaseStudies: { [key: string]: number } = {};
  selectedTestCounts: {
    [key: string]: { start: number; end: number; max: number };
  } = {};
  displayedTests: Test[] = [];
   // Track which case studies have filters applied
   filtersApplied: { [key: string]: boolean } = {};


  @ViewChild('myChart') myChart!: ElementRef;

  //inject services into code
  constructor(
    private cdr: ChangeDetectorRef,
    private testService: TestService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService // <-- Add this line
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    const userId = currentUser ? currentUser._id : null;

    if (!userId) {
        console.log('No user is logged in');
        return;
    }

    console.log(`User is logged in, user ID: ${userId}`);

    this.useCaseService.getAll().subscribe((cases) => {
        this.caseStudies = cases;

        // Initialize filtersApplied for each case study
        this.caseStudies.forEach((caseStudy) => {
            this.filtersApplied[caseStudy._id] = false;
        });

        // Once caseStudies is populated, then fetch total questions
        this.caseStudies.forEach((caseStudy) => {
            this.questionService
                .getTotalQuestionsForCaseStudy(caseStudy._id)
                .subscribe((total) => {
                    this.totalQuestionsForCaseStudies[caseStudy._id] = total;
                });
        });

        // Then fetch the test scores
        this.testService.getUserTestScores(userId).subscribe((scores) => {
            this.testScores = scores;

            // Here we populate the filter dropdowns
            this.caseStudies.forEach((caseStudy) => {
                const scoresForCaseStudy = this.testScores.filter(
                    (test) => test.caseStudyId === caseStudy._id
                );

                // Initialize the object if it's not already initialized
                if (!this.selectedTestCounts[caseStudy._id]) {
                    this.selectedTestCounts[caseStudy._id] = { start: 1, end: 0, max: 0 };
                }

                this.selectedTestCounts[caseStudy._id].max = scoresForCaseStudy.length;
                this.selectedTestCounts[caseStudy._id].end = scoresForCaseStudy.length; // set the initial end value to max tests available
                
                // Populate availableTestCounts for each case study
                this.availableTestCounts[caseStudy._id] = Array.from(
                    { length: scoresForCaseStudy.length },
                    (_, i) => i + 1
                );
           
            });

            this.prepareChartData();
            this.createOrUpdateChart();
            this.applyAllFilters(); // load chart when page loads
        });
    });
}




  createChart(): void {
    const dates: string[] = [];
    const percentages: number[] = [];

    // Organizing data for Chart.js
    this.testScores.forEach((test) => {
      if (test.createdAt && test.totalPercentage) {
        dates.push(new Date(test.createdAt).toLocaleDateString());
        percentages.push(test.totalPercentage);
      }
    });

    // Now, creating a Chart.js line chart
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Test Scores Over Time',
            data: percentages,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });
  }

  prepareChartData(): void {
    // Clear the previous chart data
    this.chartData = [];
  
    this.caseStudies.forEach((caseStudy) => {
      const percentageData = this.dataMap[caseStudy._id] || [];
      const label = `${caseStudy.caseStudyNumber} - ${caseStudy.name}`;
      this.chartData.push({
        label: label,
        data: percentageData,
      });
    });
  }
  
  createOrUpdateChart(): void {
    if (!this.myChart || !this.myChart.nativeElement) {
        return;
    }
    
    if (this.chart) {
        this.chart.destroy();
    }

    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.testScores.map((score, index) => index + 1),
        datasets: this.chartData,
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Score (%)',
            },
            ticks: {
              callback: function (tickValue) {
                return tickValue + '%';
              },
              stepSize: 10,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Number of Tests',
            },
          },
        },
      },
    });
  }

 

  onDropdownChange(): void {
    // Clear all filters
    this.filtersApplied = {};
  }
  

  applyAllFilters(): void {
    this.filtersApplied = {}; // Reset all filters first
    this.caseStudies.forEach(caseStudy => {
      this.filtersApplied[caseStudy._id] = true;
      this.updateTestView(caseStudy._id);
    });
  }

  updateTestView(caseStudyId: string): void {
    // Only update data for the selected case study
    const selectedRange = this.selectedTestCounts[caseStudyId];
    const allScoresForCaseStudy = this.testScores.filter(score => score.caseStudyId === caseStudyId);
    const endRange = Math.min(selectedRange.end, selectedRange.max);
    const scoresForSelectedRange = allScoresForCaseStudy.slice(selectedRange.start - 1, endRange);
    this.dataMap[caseStudyId] = scoresForSelectedRange.map(score => score.totalPercentage || 0);

    // Update chart data and refresh the chart
    this.prepareChartData();
    this.createOrUpdateChart();

    // Update the table view
    this.displayedTests = this.getFilteredTestsData();
  }

  getFilteredTestsData(): Test[] {
    const filteredTests: Test[] = [];
  
    this.caseStudies.forEach(caseStudy => {
      const selectedRange = this.selectedTestCounts[caseStudy._id];
      const allScoresForCaseStudy = this.testScores.filter(score => score.caseStudyId === caseStudy._id);
      const endRange = Math.min(selectedRange.end, selectedRange.max);
  
      const scoresForSelectedRange = allScoresForCaseStudy.slice(selectedRange.start - 1, endRange);
      filteredTests.push(...scoresForSelectedRange);
    });
  
    return filteredTests;
  }

  areFiltersApplied(): boolean {
    return Object.values(this.filtersApplied).some(value => value === true);
  }
  getTestsForCaseStudy(caseStudyId: string): Test[] {
    return this.displayedTests.filter(test => test.caseStudyId === caseStudyId);
  }
  
}
  
  
  
