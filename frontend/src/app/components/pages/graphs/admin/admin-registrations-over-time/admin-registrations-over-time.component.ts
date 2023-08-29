import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-registrations-over-time',
  templateUrl: './admin-registrations-over-time.component.html',
})
export class AdminRegistrationsOverTimeComponent implements OnInit, OnDestroy {
  // Implement OnDestroy

  public dateRange: number = 30; // Default to 1 month
  public registrationData: { date: string; registrations: number }[] = [];
  public allData: { date: string; registrations: number }[] = [];
  public chart: any;

  private subscriptions: Subscription[] = []; // Store subscriptions

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    // Storing the subscription
    const subscription = this.userService
      .getRegistrationsOverTime()
      .subscribe((results) => {
        if (results) {
          this.allData = results.map((result: any) => ({
            date: result._id,
            registrations: result.count,
          }));

          this.filterDataAndCreateChart();
        }
      });

    this.subscriptions.push(subscription); // Track the subscription
  }

  filterDataAndCreateChart() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - this.dateRange);

    this.registrationData = this.allData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    const labels = this.registrationData.map((data) => data.date);
    const counts = this.registrationData.map((data) => data.registrations);

    this.createChart(labels, counts);
  }

  dateRangeChanged(days: number) {
    this.dateRange = days;
    this.filterDataAndCreateChart();
  }

  createChart(labels: string[], counts: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('registrationChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'User Registrations',
            data: counts,
            borderColor: 'blue',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'User Count',
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    // Added ngOnDestroy to clear subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
