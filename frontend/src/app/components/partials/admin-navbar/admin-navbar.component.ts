import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  // Implement OnDestroy

  screenWidth: number = window.innerWidth; // Directly initialize with the current width
  isMobile: boolean = this.screenWidth < 768;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  // Extracting the logic to determine the screen size
  private checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 768;
  }

  // OnDestroy lifecycle hook to remove the host listener when component gets destroyed
  ngOnDestroy() {}
}
