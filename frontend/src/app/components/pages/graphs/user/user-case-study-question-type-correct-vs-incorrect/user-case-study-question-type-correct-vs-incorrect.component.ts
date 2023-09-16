import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription, switchMap } from 'rxjs';
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
  templateUrl:
    './user-case-study-question-type-correct-vs-incorrect.component.html',
  styleUrls: [
    './user-case-study-question-type-correct-vs-incorrect.component.css',
  ],
})
export class UserCaseStudyQuestionTypeCorrectVsIncorrectComponent {
  public chart: any;
  caseStudies: CaseStudies[] = [];
  labels: string[] = [];
  userTests: Test[] = [];
  correctPercentages: number[] = []; 
  incorrectPercentages: number[] = [];
  dateRange: number = 1;
  originalUserTests: Test[] = [];

  eyeTestPercentages: number[] = [];
investigationsTestPercentages: number[] = [];
diagnosisTestPercentages: number[] = [];


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

    const subscription = this.useCaseService.getAll().pipe(
      switchMap((caseStudies: CaseStudies[]) => {
        this.caseStudies = caseStudies;
        this.labels = this.caseStudies.map(
          (caseStudy) => `${caseStudy.caseStudyNumber} - ${caseStudy.name}`
        );
        this.correctPercentages = Array(this.caseStudies.length).fill(0);
        this.incorrectPercentages = Array(this.caseStudies.length).fill(0);
        return this.testService.getUserTestScores(userId);
      })
    ).subscribe((tests: Test[]) => {
      this.originalUserTests = tests;
      this.userTests = [...this.originalUserTests];
      this.calculatePercentages();
      this.createChart();
    }, (error) => {
      console.error('Error fetching data', error);
    });

    this.subscriptions.push(subscription); // Track the subscription
  }

  calculatePercentages() {
    let caseStudyCounts: number[] = Array(this.caseStudies.length).fill(0);  
  
    this.userTests.forEach((test) => {
        const index = this.caseStudies.findIndex(cs => cs._id === test.caseStudyId);
        if (index !== -1) {
            if(test.eyeTest && typeof test.eyeTest.percentage === 'number') {
                this.eyeTestPercentages[index] += test.eyeTest.percentage;
            }
  
            if(test.investigationsTest && typeof test.investigationsTest.percentage === 'number') {
                this.investigationsTestPercentages[index] += test.investigationsTest.percentage;
            }
  
            if(test.diagnosisTest && typeof test.diagnosisTest.percentage === 'number') {
                this.diagnosisTestPercentages[index] += test.diagnosisTest.percentage;
            }
            
            caseStudyCounts[index]++;
        }
    });
  
    // Convert total percentages to averages
    for (let i = 0; i < this.caseStudies.length; i++) {
        if (caseStudyCounts[i] !== 0) {
            this.eyeTestPercentages[i] /= caseStudyCounts[i];
            this.investigationsTestPercentages[i] /= caseStudyCounts[i];
            this.diagnosisTestPercentages[i] /= caseStudyCounts[i];
        }
    }
  }
  
  


  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Eye Test',
            data: this.eyeTestPercentages,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Investigations Test',
            data: this.investigationsTestPercentages,
            backgroundColor: 'blue',
          },
          {
            label: 'Diagnosis Test',
            data: this.diagnosisTestPercentages,
            backgroundColor: 'red',
          },
        ],
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

    this.userTests = filteredTests;
    
    // Resetting percentages arrays before recalculating
    this.correctPercentages = Array(this.caseStudies.length).fill(0);
    this.incorrectPercentages = Array(this.caseStudies.length).fill(0);
    this.eyeTestPercentages = Array(this.caseStudies.length).fill(0);
this.investigationsTestPercentages = Array(this.caseStudies.length).fill(0);
this.diagnosisTestPercentages = Array(this.caseStudies.length).fill(0);
    
    this.calculatePercentages();
    this.chart.destroy();
    this.createChart();
  }

  calculateAverages(): { avgCorrect: number, avgIncorrect: number } {
    const totalCorrect = this.correctPercentages.reduce((acc, curr) => acc + curr, 0);
    const totalIncorrect = this.incorrectPercentages.reduce((acc, curr) => acc + curr, 0);

    return {
      avgCorrect: totalCorrect / this.correctPercentages.length,
      avgIncorrect: totalIncorrect / this.incorrectPercentages.length
    };
  }

  ngOnDestroy(): void { // Clear subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
