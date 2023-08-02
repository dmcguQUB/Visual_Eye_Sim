import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit{
  
  screenWidth?: number;
  isMobile?: boolean;

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 768 ? true : false;
  }
}
