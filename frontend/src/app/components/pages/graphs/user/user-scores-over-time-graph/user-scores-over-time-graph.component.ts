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


type ChartDataSets = { label: string; data: number[] };
@Component({
  selector: 'app-user-scores-over-time-graph',
  templateUrl: './user-scores-over-time-graph.component.html',
  styleUrls: ['./user-scores-over-time-graph.component.css'],
})
export class UserScoresOverTimeGraphComponent implements OnDestroy {
  caseStudies: CaseStudies[] = []; // store all case studies here
  chartData: ChartDataSets[] = [];
  chart: Chart | null = null;
  availableTestCounts: { [key: string]: number[] } = {};
  dataMap: { [key: string]: number[] } = {}; // <-- Declare it here
  testScores: Test[] = []; // to store all test scores fetched
  totalQuestionsForCaseStudies: { [key: string]: number } = {};
  selectedTestCounts: {
    [key: string]: { start: number; end: number; max: number };
  } = {};
  displayedTests: Test[] = [];
   // Track which case studies have filters applied
   private filteredScores: Test[] = [];
   filtersApplied: { [key: string]: boolean } = {};



  @ViewChild('myChart') myChart!: ElementRef;
  private destroy$ = new Subject<void>();

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
        },   (error) => {
          console.error('There was an error!', error);
        });
        
    });
}


ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
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
  
  
  
