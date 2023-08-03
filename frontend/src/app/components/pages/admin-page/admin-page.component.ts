import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UseCaseService } from 'src/app/services/usecases.service';
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
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  userScores: UserScore[] = [];
  correctCounts: number[] = [];
  incorrectCounts: number[] = [];
  originalUserScores: UserScore[] = [];
  dateRange: number = 1; // Default to 1 day
  testsCount: number[] = [];  // Add this line


  constructor(
    private userScoreService: UserScoreService,
    private useCaseService: UseCaseService
  ) {}

  ngOnInit(): void {
    this.useCaseService.getAll().subscribe((caseStudies: CaseStudies[]) => {
      this.caseStudies = caseStudies;
      this.labels = this.caseStudies.map(
        (caseStudy) => `${caseStudy.caseStudyNumber} - ${caseStudy.name}`
      );

      this.correctCounts = Array(this.caseStudies.length).fill(0);
      this.incorrectCounts = Array(this.caseStudies.length).fill(0);

      let promises = <any>[];

      this.caseStudies.forEach((caseStudy, index) => {
        let promise = this.userScoreService
          .getCorrectAndIncorrectAnswers(caseStudy._id)
          .toPromise();
        promises.push(promise);
        promise.then((result: any) => {
          this.correctCounts[index] = result.correct;
          this.incorrectCounts[index] = result.incorrect;
        });
      });
      

      this.userScoreService.getAllUserScores().subscribe((userScores) => {
        this.originalUserScores = userScores;
        this.userScores = [...this.originalUserScores];
        this.calculateCounts(); // Add this line
        this.calculateAverages(); // Add this line

        Promise.all(promises).then(() => {
          this.createChart();
        });
      });
    });
  }

  createChart() {
    let correctDataPercentages = [];
    let incorrectDataPercentages = [];

    for (let i = 0; i < this.caseStudies.length; i++) {
      let total = this.correctCounts[i] + this.incorrectCounts[i];

      correctDataPercentages.push((this.correctCounts[i] / total) * 100);
      incorrectDataPercentages.push((this.incorrectCounts[i] / total) * 100);
    }

    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels,
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
    let endDate = new Date(); // today
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - this.dateRange); // X days ago

    this.userScores = this.originalUserScores.filter((userScore) => {
      let testDate = new Date(userScore.testTakenAt);
      return testDate >= startDate && testDate <= endDate;
    });

    this.calculateCounts();
    this.chart.destroy();
    this.createChart();
    this.calculateAverages(); // Add this line
  }

  calculateCounts() {
    this.correctCounts = Array(this.caseStudies.length).fill(0);
    this.incorrectCounts = Array(this.caseStudies.length).fill(0);
    this.testsCount = Array(this.caseStudies.length).fill(0); // Add this line

    this.userScores.forEach((userScore) => {
      let caseStudyIndex = this.caseStudies.findIndex(
        (caseStudy) => caseStudy._id === userScore.caseStudyId
      );
      if (caseStudyIndex !== -1) {
        this.testsCount[caseStudyIndex]++; // Increment the tests count
        userScore.answers.forEach((answer) => {
          if (answer.correct) {
            this.correctCounts[caseStudyIndex]++;
          } else {
            this.incorrectCounts[caseStudyIndex]++;
          }
        });
      }
    });
  }


  //calculate the averages for the table
  calculateAverages() {
    let sumCorrectPercentages = 0;
    let sumIncorrectPercentages = 0;
    let count = 0; // count of case studies with tests
  
    for (let i = 0; i < this.correctCounts.length; i++) {
      const totalAnswers = this.correctCounts[i] + this.incorrectCounts[i];
  
      if (totalAnswers !== 0) { // if there are tests for the case study
        const correctPercentage = this.correctCounts[i] / totalAnswers * 100;
        const incorrectPercentage = this.incorrectCounts[i] / totalAnswers * 100;
  
        sumCorrectPercentages += correctPercentage;
        sumIncorrectPercentages += incorrectPercentage;
        count++;
      }
    }
  
    // Calculate averages based on the count of case studies with tests
    const avgCorrect = sumCorrectPercentages / count;
    const avgIncorrect = sumIncorrectPercentages / count;
  
    return {
      avgCorrect: avgCorrect.toFixed(2),
      avgIncorrect: avgIncorrect.toFixed(2)
    };
  }
  
  
  
  totalTests() {
    return this.testsCount.reduce((acc, cur) => acc + cur, 0);
  }
  
}
