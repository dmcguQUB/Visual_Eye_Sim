import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { finalize, Subscription, switchMap } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Test } from 'src/app/shared/models/test';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-case-study-correct-vs-incorrect',
  templateUrl: './admin-case-study-correct-vs-incorrect.component.html',
  styleUrls: ['./admin-case-study-correct-vs-incorrect.component.css'],
})
export class AdminCaseStudyCorrectVsIncorrectComponent
  implements OnInit, OnDestroy
{
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  correctPercentages: number[] = [];
  incorrectPercentages: number[] = [];
  dateRange: number = 1;
  public originalAllTests: any[] = [];
  public allTests: any[] = [];
  numberOfTests: number[] = [];

  private subscriptions: Subscription[] = []; // Track all component subscriptions

  constructor(
    private useCaseService: UseCaseService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
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
          return this.testService.getAllTestScores();
        })
      )
      .pipe(
        finalize(() => {
          this.calculatePercentages();
          this.createChart();
        })
      )
      .subscribe(
        (tests: any[]) => {
          this.originalAllTests = tests;
          this.allTests = [...this.originalAllTests];
        },
        (error) => {
          console.error('Error fetching tests:', error);
        }
      );

    this.subscriptions.push(subscription);
  }

  // Calculate correct and incorrect percentages for each case study
  calculatePercentages() {
    this.correctPercentages = Array(this.caseStudies.length).fill(0);
    this.incorrectPercentages = Array(this.caseStudies.length).fill(0);
    this.numberOfTests = Array(this.caseStudies.length).fill(0);

    this.caseStudies.forEach((caseStudy, index) => {
      const testsForCaseStudy = this.allTests.filter(
        (test) => test.caseStudyId === caseStudy._id
      );

      if (testsForCaseStudy.length === 0) return; // No tests for this case study.

      let totalCorrectPercentage = 0;
      let totalIncorrectPercentage = 0;

      testsForCaseStudy.forEach((test) => {
        const eyeTestCorrect =
          (test.eyeTest.correctAnswers / test.eyeTest.totalQuestions) * 100 ||
          0;
        const investigationsTestCorrect =
          (test.investigationsTest.correctAnswers /
            test.investigationsTest.totalQuestions) *
            100 || 0;
        const diagnosisTestCorrect =
          (test.diagnosisTest.correctAnswers /
            test.diagnosisTest.totalQuestions) *
            100 || 0;

        const avgCorrect =
          (eyeTestCorrect + investigationsTestCorrect + diagnosisTestCorrect) /
          3;
        totalCorrectPercentage += avgCorrect;
        totalIncorrectPercentage += 100 - avgCorrect;
      });

      this.correctPercentages[index] =
        totalCorrectPercentage / testsForCaseStudy.length;
      this.incorrectPercentages[index] =
        totalIncorrectPercentage / testsForCaseStudy.length;
      this.numberOfTests[index] = testsForCaseStudy.length;
    });
  }

  // Create and update the chart displaying correct vs. incorrect percentages
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

    const filteredTests = this.originalAllTests.filter((test) => {
      if (!test.createdAt) {
        return false;
      }
      const testDate = new Date(test.createdAt);
      return testDate >= startDate && testDate <= endDate;
    });

    this.allTests = filteredTests;

    // Resetting percentages arrays before recalculating
    this.correctPercentages = Array(this.caseStudies.length).fill(0);
    this.incorrectPercentages = Array(this.caseStudies.length).fill(0);

    this.calculatePercentages();
    this.chart.destroy();
    this.createChart();
  }

  // Calculate average correct and incorrect percentages
  calculateAverages(): { avgCorrect: number; avgIncorrect: number } {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalTests = 0;

    for (let i = 0; i < this.correctPercentages.length; i++) {
      totalCorrect += this.correctPercentages[i] * this.numberOfTests[i];
      totalIncorrect += this.incorrectPercentages[i] * this.numberOfTests[i];
      totalTests += this.numberOfTests[i];
    }

    return {
      avgCorrect: totalTests ? totalCorrect / totalTests : 0,
      avgIncorrect: totalTests ? totalIncorrect / totalTests : 0,
    };
  }
  ngOnDestroy(): void {
    // Clean up all component subscriptions to avoid memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
