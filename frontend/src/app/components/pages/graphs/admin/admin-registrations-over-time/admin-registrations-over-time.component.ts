import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-registrations-over-time',
  templateUrl: './admin-registrations-over-time.component.html',
  styleUrls: ['./admin-registrations-over-time.css'],
})
export class AdminRegistrationsOverTimeComponent implements OnInit, OnDestroy {
  public dateRange: number = 30; // Default to 30 days
  public registrationData: { date: string; registrations: number }[] = [];
  public allData: { date: string; registrations: number }[] = [];
  public chart: any;

  // Data filter and pagination properties
  public currentPage: number = 1;
  public pageSize: number = 5;
  public sortDirection: string = 'asc';
  public sortColumn: string = 'date';
  public maxPage: number = 20; // Maximum number of pages
  public totalPages: number = 1;

  private subscriptions: Subscription[] = []; // Store subscriptions

  constructor(
    private userService: UserService,
    private dataFilterService: DataFilterService
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  // Load chart data from the server
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

  // Filter data based on date range and create/update the chart
  filterDataAndCreateChart() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - this.dateRange);

    // Create a new array for the filtered data
    const filteredData = this.allData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    const labels = filteredData.map((data) => data.date);
    const counts = filteredData.map((data) => data.registrations);

    this.createChart(labels, counts);
    this.sortAndPaginateUsing(filteredData); // Pass the filtered data to the sort and paginate method
    this.computeTotalPagesUsing(filteredData); // Pass the filtered data to compute the total pages
  }

  // Handle changes in the date range filter
  dateRangeChanged(days: number) {
    this.dateRange = days;

    // Clear the data
    this.registrationData = [];

    // Filter and populate chart and table with new data
    this.filterDataAndCreateChart();
  }

  // Create or update the chart with provided labels and data
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

  // Handle sorting and pagination of data for the table
  sortAndPaginateUsing(dataArray: any[]) {
    let sortedData = this.dataFilterService.sort(
      dataArray,
      this.sortColumn,
      this.sortDirection
    );
    this.maxPage = Math.ceil(sortedData.length / this.pageSize);
    this.registrationData = this.dataFilterService.paginate(
      sortedData,
      this.pageSize,
      this.currentPage
    );
  }

  // Compute the total number of pages for pagination
  computeTotalPagesUsing(dataArray: any[]) {
    this.totalPages = Math.ceil(dataArray.length / this.pageSize);
  }

  // Handle sorting when a table header is clicked
  onHeaderClick(column: string) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortAndPaginateUsing(this.allData); // Pass `this.allData` as the argument
  }

  // Go to the next page of the table
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.sortAndPaginateUsing(this.allData); // Pass `this.allData` as the argument
    }
  }

  // Go to the previous page of the table
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.sortAndPaginateUsing(this.allData); // Pass `this.allData` as the argument
    }
  }

  ngOnDestroy(): void {
    // Added ngOnDestroy to clear subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
