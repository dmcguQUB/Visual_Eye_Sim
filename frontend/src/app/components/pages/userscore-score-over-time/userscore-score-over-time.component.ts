import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import 'chartjs-adapter-moment';
import { UserScoreService } from 'src/app/services/userscores.service';
import { UserService } from 'src/app/services/user.service';
import { UserScore } from 'src/app/shared/models/UserScore';

type ChartDataSets = { label: string, data: number[] };

@Component({
  selector: 'app-userscore-score-over-time',
  templateUrl: './userscore-score-over-time.component.html',
  styleUrls: ['./userscore-score-over-time.component.css']
})
export class UserscoreScoreOverTimeComponent implements OnInit, AfterViewInit {
  userScores: UserScore[] = [];
  chartData: ChartDataSets[] = [];
  chart!: Chart;
  @ViewChild('myChart') myChart!: ElementRef;

  constructor(private userScoreService: UserScoreService, private userService: UserService) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    const userId = currentUser ? currentUser._id : null;

    if (userId) {
      console.log(`User is logged in, user ID: ${userId}`);
      this.userScoreService.getUserScores(userId)
        .subscribe(scores => {
          this.userScores = scores;
          this.prepareChartData();
          this.createChart();
        });
    } else {
      console.log('No user is logged in');
    }
  }

  ngAfterViewInit(): void {}

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart<'line', number[], unknown>(this.myChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.userScores.map((score, index) => index + 1),  // assuming the userScores array is in chronological order
        datasets: this.chartData
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  

  private prepareChartData(): void {
    const caseStudies: { [key: string]: number[] } = {};

    this.userScores.forEach(score => {
      if (!caseStudies[score.caseStudyId]) {
        caseStudies[score.caseStudyId] = [];
      }
      caseStudies[score.caseStudyId].push(score.score);
    });

    for (const caseStudyId in caseStudies) {
      this.chartData.push({
        label: caseStudyId,
        data: caseStudies[caseStudyId]
      });
    }
  }
}
