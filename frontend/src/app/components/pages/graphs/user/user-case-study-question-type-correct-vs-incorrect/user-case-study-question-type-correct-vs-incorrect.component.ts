import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { UserService } from 'src/app/services/user.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { QuestionType } from 'src/app/shared/models/question-type';
import { Test } from 'src/app/shared/models/test';
Chart.register(...registerables);
type TestType = 'test1' | 'test2' | 'test3';

@Component({
  selector: 'app-user-case-study-question-type-correct-vs-incorrect',
  templateUrl: './user-case-study-question-type-correct-vs-incorrect.component.html',
  styleUrls: ['./user-case-study-question-type-correct-vs-incorrect.component.css']
})
export class UserCaseStudyQuestionTypeCorrectVsIncorrectComponent implements OnInit, OnDestroy {
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  userTests: Test[] = [];
  correctPercentages: {
      eyetest: number,
      investigations: number,
      diagnosis: number
  }[] = [];
  incorrectPercentages: {
      eyetest: number,
      investigations: number,
      diagnosis: number
  }[] = [];
  dateRange: number = 1;
  originalUserTests: Test[] = [];
  public selectedCaseStudy: string | null = null;

  private subscriptions: Subscription[] = []; // Collects all subscriptions


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
  
    const caseStudySubscription = this.useCaseService.getAll().subscribe((caseStudies: CaseStudies[]) => {
      this.caseStudies = caseStudies;
      this.labels = [];
  
      this.caseStudies.forEach(caseStudy => {
        this.labels.push(`${caseStudy.caseStudyNumber} - ${caseStudy.name} - Eye Test`);
        this.labels.push(`${caseStudy.caseStudyNumber} - ${caseStudy.name} - Investigation`);
        this.labels.push(`${caseStudy.caseStudyNumber} - ${caseStudy.name} - Diagnosis`);
      });
  
      this.correctPercentages = Array(this.caseStudies.length).fill({ eyetest: 0, investigations: 0, diagnosis: 0 });
      this.incorrectPercentages = Array(this.caseStudies.length).fill({ eyetest: 0, investigations: 0, diagnosis: 0 });
  
      const testScoresSubscription = this.testService.getUserTestScores(userId).subscribe((tests: Test[]) => {
        this.originalUserTests = tests;
        this.updateChartAndTable();
      });
  
      this.subscriptions.push(testScoresSubscription);
    });
  
    this.subscriptions.push(caseStudySubscription);
  }
  

  ngOnDestroy(): void {
    // Unsubscribe from all active subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  calculatePercentages() {
    // Initialize with default values
    this.correctPercentages = this.caseStudies.map(cs => ({ eyetest: 0, investigations: 0, diagnosis: 0 }));
    this.incorrectPercentages = this.caseStudies.map(cs => ({ eyetest: 0, investigations: 0, diagnosis: 0 }));

    this.userTests.forEach((test) => {
        const index = this.caseStudies.findIndex(cs => cs._id === test.caseStudyId);
        if (index !== -1) {
            if (test.eyeTest && typeof test.eyeTest.percentage === 'number') {
                this.correctPercentages[index].eyetest = test.eyeTest.percentage;
                this.incorrectPercentages[index].eyetest = 100 - test.eyeTest.percentage;
            }

            if (test.investigationsTest && typeof test.investigationsTest.percentage === 'number') {
                this.correctPercentages[index].investigations = test.investigationsTest.percentage;
                this.incorrectPercentages[index].investigations = 100 - test.investigationsTest.percentage;
            }

            if (test.diagnosisTest && typeof test.diagnosisTest.percentage === 'number') {
                this.correctPercentages[index].diagnosis = test.diagnosisTest.percentage;
                this.incorrectPercentages[index].diagnosis = 100 - test.diagnosisTest.percentage;
            }
        }
    });
}
  
  
createChart() {
  // Create new structure for labels and data
  const newLabels = ['Eye Test', 'Investigation', 'Diagnosis'];

  const datasets: { label: string; data: number[]; backgroundColor: string; }[] = [];

  // Loop through each case study and add its data to the dataset
  this.caseStudies.forEach(caseStudy => {
      const index = this.caseStudies.findIndex(cs => cs._id === caseStudy._id);
      datasets.push({
          label: `${caseStudy.caseStudyNumber} - ${caseStudy.name} - Correct`,
          data: [
              this.correctPercentages[index].eyetest,
              this.correctPercentages[index].investigations,
              this.correctPercentages[index].diagnosis
          ],
          backgroundColor: 'limegreen',
      });
      datasets.push({
          label: `${caseStudy.caseStudyNumber} - ${caseStudy.name} - Incorrect`,
          data: [
              this.incorrectPercentages[index].eyetest,
              this.incorrectPercentages[index].investigations,
              this.incorrectPercentages[index].diagnosis
          ],
          backgroundColor: 'red',
      });
  });

  this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
          labels: newLabels,
          datasets: datasets
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

    const filteredTests = this.originalUserTests.filter((test) => {
      if (!test.createdAt) {
        return false;
      }
      const testDate = new Date(test.createdAt);
      return testDate >= startDate && testDate <= endDate;
    });

    this.originalUserTests = filteredTests;
    this.updateChartAndTable();
    
  }

  calculateAverages(): { avgCorrect: number, avgIncorrect: number } {
    const totalCorrect = this.correctPercentages.reduce((acc, curr) => {
      return {
        eyetest: acc.eyetest + curr.eyetest,
        investigations: acc.investigations + curr.investigations,
        diagnosis: acc.diagnosis + curr.diagnosis
      };
    }, { eyetest: 0, investigations: 0, diagnosis: 0 });
    
    const totalIncorrect = this.incorrectPercentages.reduce((acc, curr) => {
      return {
        eyetest: acc.eyetest + curr.eyetest,
        investigations: acc.investigations + curr.investigations,
        diagnosis: acc.diagnosis + curr.diagnosis
      };
    }, { eyetest: 0, investigations: 0, diagnosis: 0 });
    
    const totalCount = this.caseStudies.length;
    const avgCorrect = {
      eyetest: totalCorrect.eyetest / totalCount,
      investigations: totalCorrect.investigations / totalCount,
      diagnosis: totalCorrect.diagnosis / totalCount
    };

    const avgIncorrect = {
      eyetest: totalIncorrect.eyetest / totalCount,
      investigations: totalIncorrect.investigations / totalCount,
      diagnosis: totalIncorrect.diagnosis / totalCount
    };

    // If you want a single average across all types
    const avgCorrectOverall = (avgCorrect.eyetest + avgCorrect.investigations + avgCorrect.diagnosis) / 3;
    const avgIncorrectOverall = (avgIncorrect.eyetest + avgIncorrect.investigations + avgIncorrect.diagnosis) / 3;
    console.log(this.correctPercentages);
    console.log(this.incorrectPercentages);
    
    return {
      avgCorrect: avgCorrectOverall,
      avgIncorrect: avgIncorrectOverall
    };
}

onCaseStudyChange(caseStudyId: string): void {
  this.selectedCaseStudy = caseStudyId;
  if (caseStudyId === 'all') {
    this.selectedCaseStudy = null;
  } else {
    this.selectedCaseStudy = caseStudyId;
  }

  this.updateChartAndTable();
}

updateChartAndTable() {
  // Filtering tests based on selected case study
  if (this.selectedCaseStudy) {
    this.userTests = this.originalUserTests.filter(test => test.caseStudyId === this.selectedCaseStudy);
  } else {
    this.userTests = [...this.originalUserTests];
  }

  // Resetting percentages arrays before recalculating
  this.correctPercentages = Array(this.caseStudies.length).fill({ eyetest: 0, investigations: 0, diagnosis: 0 });
  this.incorrectPercentages = Array(this.caseStudies.length).fill({ eyetest: 0, investigations: 0, diagnosis: 0 });

  this.calculatePercentages();

  // Destroy the existing chart and create a new one
  if (this.chart) {
    this.chart.destroy();
  }
  this.createChart();
}


}
