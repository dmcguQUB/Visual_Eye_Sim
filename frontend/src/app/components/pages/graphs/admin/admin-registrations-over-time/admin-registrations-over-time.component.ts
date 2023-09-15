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
  // Implement OnDestroy

  public dateRange: number = 30; // Default to 1 month
  public registrationData: { date: string; registrations: number }[] = [];
  public allData: { date: string; registrations: number }[] = [];
  public chart: any;

  //data filter and pagination
  public currentPage: number = 1;
public pageSize: number = 5;
public sortDirection: string = 'asc';
public sortColumn: string = 'date';
public maxPage: number=20;
public totalPages: number = 1;



  private subscriptions: Subscription[] = []; // Store subscriptions

  constructor(private userService: UserService,   private dataFilterService: DataFilterService    ) {}

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

    // Create a new array for the filtered data
    const filteredData = this.allData.filter((data) => {
        const dataDate = new Date(data.date);
        return dataDate >= startDate && dataDate <= endDate;
    });

    const labels = filteredData.map((data) => data.date);
    const counts = filteredData.map((data) => data.registrations);

    this.createChart(labels, counts);
    this.sortAndPaginateUsing(filteredData); // pass the filtered data to the sort and paginate method
    this.computeTotalPagesUsing(filteredData); // pass the filtered data to compute the total pages
}

  

  dateRangeChanged(days: number) {
    this.dateRange = days;

       // Clear the data
       this.registrationData = [];

       //filter and populate chart and table with new data
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

  //CODE RELATED TO TABLE FILTER AND PAGINATION

  
  sortAndPaginateUsing(dataArray: any[]) {
    let sortedData = this.dataFilterService.sort(dataArray, this.sortColumn, this.sortDirection);
    this.maxPage = Math.ceil(sortedData.length / this.pageSize);
    this.registrationData = this.dataFilterService.paginate(sortedData, this.pageSize, this.currentPage);
}

computeTotalPagesUsing(dataArray: any[]) {
    this.totalPages = Math.ceil(dataArray.length / this.pageSize);
}
  
onHeaderClick(column: string) {
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.sortColumn = column;
  this.sortAndPaginateUsing(this.allData); // Pass `this.allData` as the argument
}

nextPage() {
  if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.sortAndPaginateUsing(this.allData); // Pass `this.allData` as the argument
  }
}

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

