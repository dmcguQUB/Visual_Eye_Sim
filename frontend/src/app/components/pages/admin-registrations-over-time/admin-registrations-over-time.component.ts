// Import required dependencies
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-registrations-over-time',
  templateUrl: './admin-registrations-over-time.component.html',
  styleUrls: ['./admin-registrations-over-time.component.css']
})
export class AdminRegistrationsOverTimeComponent  implements OnInit {


    public chart: any;
  
    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      this.loadChartData();
    }
  
    async loadChartData() {
      const results = await this.userService.getRegistrationsOverTime().toPromise();
      
      if (results) {
        const labels = results.map((result:any) => result._id); // _id field holds the date
        const counts = results.map((result:any) => result.count); // count field holds the number of registrations
        this.createChart(labels, counts);
      }
    }
  
    createChart(labels: string[], counts: number[]) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      this.chart = new Chart('registrationChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'User Registrations',
            data: counts,
            borderColor: 'blue',
            fill: false
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              title: {
                display: true,
                text: 'User Count'
              }
            },
          },
        }
      });
    }
  }


