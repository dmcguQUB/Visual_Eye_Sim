import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Test } from 'src/app/shared/models/test';
Chart.register(...registerables);


@Component({
  selector: 'app-admin-case-study-correct-vs-incorrect',
  templateUrl: './admin-case-study-correct-vs-incorrect.component.html',
  styleUrls: ['./admin-case-study-correct-vs-incorrect.component.css']
})
export class AdminCaseStudyCorrectVsIncorrectComponent implements OnInit {
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  correctPercentages: number[] = []; 
  incorrectPercentages: number[] = [];
  dateRange: number = 1;
  public originalAllTests: any[] = [];
  public allTests: any[] = [];
  numberOfTests: number[] = [];



  constructor(
    private useCaseService: UseCaseService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.useCaseService.getAll().subscribe((caseStudies: CaseStudies[]) => {
      this.caseStudies = caseStudies;
      this.labels = this.caseStudies.map(
        (caseStudy) => `${caseStudy.caseStudyNumber} - ${caseStudy.name}`
      );

      this.correctPercentages = Array(this.caseStudies.length).fill(0);
      this.incorrectPercentages = Array(this.caseStudies.length).fill(0);

      this.testService.getAllTestScores().subscribe(
        (tests: any[]) => {
          this.originalAllTests = tests;
          this.allTests = [...this.originalAllTests];  // Create a copy of the original data
          this.calculatePercentages();
          this.createChart();
        },
        error => {
          console.error('Error fetching tests:', error);
        }
      );
      
      
    });
  }

  calculatePercentages() {
    this.correctPercentages = Array(this.caseStudies.length).fill(0);
    this.incorrectPercentages = Array(this.caseStudies.length).fill(0);
    this.numberOfTests = Array(this.caseStudies.length).fill(0);


    this.caseStudies.forEach((caseStudy, index) => {
        const testsForCaseStudy = this.allTests.filter(test => test.caseStudyId === caseStudy._id);
        
        if (testsForCaseStudy.length === 0) return; // No tests for this case study.

        let totalCorrectPercentage = 0;
        let totalIncorrectPercentage = 0;

        testsForCaseStudy.forEach(test => {
            const eyeTestCorrect = (test.eyeTest.correctAnswers / test.eyeTest.totalQuestions) * 100 || 0;
            const investigationsTestCorrect = (test.investigationsTest.correctAnswers / test.investigationsTest.totalQuestions) * 100 || 0;
            const diagnosisTestCorrect = (test.diagnosisTest.correctAnswers / test.diagnosisTest.totalQuestions) * 100 || 0;

            const avgCorrect = (eyeTestCorrect + investigationsTestCorrect + diagnosisTestCorrect) / 3;
            totalCorrectPercentage += avgCorrect;
            totalIncorrectPercentage += (100 - avgCorrect);
        });

        this.correctPercentages[index] = totalCorrectPercentage / testsForCaseStudy.length;
        this.incorrectPercentages[index] = totalIncorrectPercentage / testsForCaseStudy.length;
        this.numberOfTests[index] = testsForCaseStudy.length;

    });
}

  

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

  calculateAverages(): { avgCorrect: number, avgIncorrect: number } {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalTests = 0;

    for(let i = 0; i < this.correctPercentages.length; i++) {
        totalCorrect += this.correctPercentages[i] * this.numberOfTests[i];
        totalIncorrect += this.incorrectPercentages[i] * this.numberOfTests[i];
        totalTests += this.numberOfTests[i];
    }

    return {
      avgCorrect: totalTests ? totalCorrect / totalTests : 0,
      avgIncorrect: totalTests ? totalIncorrect / totalTests : 0
    };
}

}