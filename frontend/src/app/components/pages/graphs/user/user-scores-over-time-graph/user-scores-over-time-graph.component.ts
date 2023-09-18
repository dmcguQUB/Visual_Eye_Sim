// Import necessary modules and components from Angular and other libraries
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Subject, takeUntil } from 'rxjs';
import { QuestionService } from 'src/app/services/questions.service';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Test } from 'src/app/shared/models/test';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

// Define a type for chart data sets
type ChartDataSets = { label: string; data: number[] };

@Component({
  selector: 'app-user-scores-over-time-graph',
  templateUrl: './user-scores-over-time-graph.component.html',
  styleUrls: ['./user-scores-over-time-graph.component.css'],
})
export class UserScoresOverTimeGraphComponent implements OnDestroy {
  // Declare and initialize various data arrays and objects
  caseStudies: CaseStudies[] = []; // Store all case studies here
  chartData: ChartDataSets[] = [];
  chart: Chart | null = null;
  availableTestCounts: { [key: string]: number[] } = {};
  dataMap: { [key: string]: number[] } = {}; // Stores test score data
  testScores: Test[] = []; // To store all test scores fetched
  totalQuestionsForCaseStudies: { [key: string]: number } = {}; // Store total questions for case studies
  selectedTestCounts: {
    [key: string]: { start: number; end: number; max: number };
  } = {}; // Track selected test counts
  displayedTests: Test[] = []; // Store displayed test data

  // Track which case studies have filters applied
  private filteredScores: Test[] = [];
  filtersApplied: { [key: string]: boolean } = {};

  // Reference to the chart element in the template
  @ViewChild('myChart') myChart!: ElementRef;

  // Create a subject to handle component destruction
  private destroy$ = new Subject<void>();

  // Inject services into the constructor
  constructor(
    private cdr: ChangeDetectorRef,
    private testService: TestService,
    private userService: UserService,
    private useCaseService: UseCaseService,
    private questionService: QuestionService
  ) {}

  // Initialize component
  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    const userId = currentUser ? currentUser._id : null;

    if (!userId) {
      console.log('No user is logged in');
      return;
    }

    // First, fetch all case studies.
    this.useCaseService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cases) => {
        this.caseStudies = cases;

        // Initialize filtersApplied for each case study
        this.caseStudies.forEach((caseStudy) => {
          this.filtersApplied[caseStudy._id] = false;
        });

        // Once caseStudies is populated, fetch total questions for each case study.
        this.caseStudies.forEach((caseStudy) => {
          this.questionService.getTotalQuestionsForCaseStudy(caseStudy._id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((total) => {
              this.totalQuestionsForCaseStudies[caseStudy._id] = total;
            });
        });

        // After fetching the case studies, fetch the user's test scores.
        this.testService.getUserTestScores(userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((scores) => {
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
          }, (error) => {
            console.error('There was an error!', error);
          });

      });
  }

  // Clean up resources when the component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Create the initial Chart.js chart
  createChart(): void {
    const dates: string[] = [];
    const percentages: number[] = [];

    // Organize data for Chart.js
    this.testScores.forEach((test) => {
      if (test.createdAt && test.totalPercentage) {
        dates.push(new Date(test.createdAt).toLocaleDateString());
        percentages.push(test.totalPercentage);
      }
    });

    // Create a Chart.js line chart
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

  // Prepare data for chart update
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

  // Update the test view based on selected filters
  updateTestView(caseStudyId: string): void {
    const selectedRange = this.selectedTestCounts[caseStudyId];
    const allScoresForCaseStudy = this.testScores.filter(score => score.caseStudyId === caseStudyId);
    const endRange = Math.min(selectedRange.end, selectedRange.max);
    const scoresForSelectedRange = allScoresForCaseStudy.slice(selectedRange.start - 1, endRange);

    // Update only the filteredScores of the current case study, keep the rest intact
    this.filteredScores = this.filteredScores.filter(score => score.caseStudyId !== caseStudyId);
    this.filteredScores.push(...scoresForSelectedRange);

    this.dataMap[caseStudyId] = scoresForSelectedRange.map(score => score.totalPercentage || 0);

    // Update chart data and refresh the chart
    this.prepareChartData();
    this.createOrUpdateChart();

    // Update the table view
    this.displayedTests = this.getFilteredTestsData();
  }

  // Create or update the Chart.js chart
  createOrUpdateChart(): void {
    if (!this.myChart || !this.myChart.nativeElement) {
      return;
    }

    if (!this.filteredScores || this.filteredScores.length === 0) {
      console.warn('No filtered test scores available to plot');
      return;
    }

    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy();
      this.chart = null;
    }

    // Use filteredScores here for the chart labels
    const labels = this.filteredScores.map((_, index) => index + 1);

    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
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
            type: 'linear',
            title: {
              display: true,
              text: 'Test Number',
            },
            min: 1, // Moved out of ticks
            max: this.filteredScores.length, // Moved out of ticks
          },
        },
      },
    });
  }

  // Handle dropdown change event by clearing all filters
  onDropdownChange(): void {
    // Clear all filters
    this.filtersApplied = {};
  }

  // Apply all filters to the data
  applyAllFilters(): void {
    this.filtersApplied = {}; // Reset all filters first
    this.caseStudies.forEach(caseStudy => {
      this.filtersApplied[caseStudy._id] = true;
      this.updateTestView(caseStudy._id);
    });
  }

  // Get filtered test data based on selected filters
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

  // Check if any filters are applied
  areFiltersApplied(): boolean {
    return Object.values(this.filtersApplied).some(value => value === true);
  }

  // Get tests for a specific case study
  getTestsForCaseStudy(caseStudyId: string): Test[] {
    return this.displayedTests.filter(test => test.caseStudyId === caseStudyId);
  }
}
