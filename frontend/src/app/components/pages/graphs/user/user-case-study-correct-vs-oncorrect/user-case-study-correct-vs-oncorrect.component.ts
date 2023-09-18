import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription, switchMap } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Test } from 'src/app/shared/models/test';
Chart.register(...registerables);

@Component({
  selector: 'app-user-case-study-correct-vs-oncorrect.component',
  templateUrl: './user-case-study-correct-vs-oncorrect.component.html',
  styleUrls: ['./user-case-study-correct-vs-oncorrect.component.css'],
})
export class UserCaseStudyCorrectVsOncorrectComponent
  implements OnInit, OnDestroy
{
  // Added OnDestroy
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  userTests: Test[] = [];
  correctPercentages: number[] = [];
  incorrectPercentages: number[] = [];
  dateRange: number = 1;
  originalUserTests: Test[] = [];

  private subscriptions: Subscription[] = []; // Store subscriptions

  constructor(
    private useCaseService: UseCaseService,
    private userService: UserService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    const userId = currentUser ? currentUser._id : null;

    if (!userId) {
      console.log('No user is logged in');
      return;
    }
    // Load case studies and user test data
    const subscription = this.useCaseService
      .getAll()
      .pipe(
        switchMap((caseStudies: CaseStudies[]) => {
          this.caseStudies = caseStudies;
          this.labels = this.caseStudies.map(
            (caseStudy) => `${caseStudy.caseStudyNumber} - ${caseStudy.name}`
          );
          this.correctPercentages = Array(this.caseStudies.length).fill(0);
          this.incorrectPercentages = Array(this.caseStudies.length).fill(0);
          return this.testService.getUserTestScores(userId);
        })
      )
      .subscribe(
        (tests: Test[]) => {
          this.originalUserTests = tests;
          this.userTests = [...this.originalUserTests];
          this.calculatePercentages();
          this.createChart();
        },
        (error) => {
          console.error('Error fetching data', error);
        }
      );

    this.subscriptions.push(subscription); // Track the subscription
  }

  // Calculate correct and incorrect percentages for each case study
  calculatePercentages() {
    let caseStudyCounts: number[] = Array(this.caseStudies.length).fill(0); // Number of tests per case study

    this.userTests.forEach((test) => {
      const index = this.caseStudies.findIndex(
        (cs) => cs._id === test.caseStudyId
      );
      if (index !== -1) {
        if (typeof test.totalPercentage === 'number') {
          this.correctPercentages[index] += test.totalPercentage;
          this.incorrectPercentages[index] += 100 - test.totalPercentage;
          caseStudyCounts[index]++;
        } else {
          // Handle the case where test.totalPercentage is undefined
          this.incorrectPercentages[index] += 100;
          caseStudyCounts[index]++;
        }
      }
    });

    // Convert total percentages to averages
    for (let i = 0; i < this.caseStudies.length; i++) {
      if (caseStudyCounts[i] !== 0) {
        this.correctPercentages[i] /= caseStudyCounts[i];
        this.incorrectPercentages[i] /= caseStudyCounts[i];
      }
    }
  }

  // Create or update the chart with provided labels and data
  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Correct',
            data: this.correctPercentages,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Incorrect',
            data: this.incorrectPercentages,
            backgroundColor: 'red',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + '%';
              },
            },
          },
        },
      },
    });
  }

  // Handle changes in the date range filter
  dateRangeChanged(days: number) {
    this.dateRange = days;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - this.dateRange);

    const filteredTests = this.originalUserTests.filter((test) => {
      if (!test.createdAt) {
        return false;
      }
      const testDate = new Date(test.createdAt);
      return testDate >= startDate && testDate <= endDate;
    });

    this.userTests = filteredTests;

    // Resetting percentages arrays before recalculating
    this.correctPercentages = Array(this.caseStudies.length).fill(0);
    this.incorrectPercentages = Array(this.caseStudies.length).fill(0);

    this.calculatePercentages();
    this.chart.destroy();
    this.createChart();
  }

  // Calculate the average correct and incorrect percentages
  calculateAverages(): { avgCorrect: number; avgIncorrect: number } {
    const totalCorrect = this.correctPercentages.reduce(
      (acc, curr) => acc + curr,
      0
    );
    const totalIncorrect = this.incorrectPercentages.reduce(
      (acc, curr) => acc + curr,
      0
    );

    return {
      avgCorrect: totalCorrect / this.correctPercentages.length,
      avgIncorrect: totalIncorrect / this.incorrectPercentages.length,
    };
  }

  ngOnDestroy(): void {
    // Clear subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
