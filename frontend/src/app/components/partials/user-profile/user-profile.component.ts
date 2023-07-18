// frontend/src/app/components/partials/user-profile/user-profile.component.ts

import { Component, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="auth.user$ | async as user" class="dropdown" [class.open]="isOpen">
      <button class="dropdown-toggle user-profile-button" id="dropdownMenuButton" (click)="toggleDropdown()">
        User Profile
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item">{{ user.nickname }}</a>
        <a class="dropdown-item">{{ user.email }}</a>
      </div>
    </div>
  `,
  styles: [`
    .user-profile-button {
      padding: 1rem;
      display: block;
      text-decoration: none;
      border-radius: 15px;
      transition: background-color 0.3s;
      color: #495057; /* Dark grey */
      background-color: #e9ecef; /* Light grey */
      border: none;
      margin-bottom: 1rem;
    }
    .user-profile-button:hover {
      background-color: #caccd1; /* Darker light grey */
    }
    .dropdown-menu {
      background-color: #e9ecef; /* Light grey */
      display: none;
    }
    .dropdown.open .dropdown-menu {
      display: block;
    }
    .dropdown-item {
      color: #495057; /* Dark grey */
    }
    .dropdown-item:hover {
      color: #6c757d; /* Darker grey */
      background-color: #caccd1; /* Darker light grey */
    }
  `]
})
export class UserProfileComponent {
  isOpen = false;
  
  constructor(public auth: AuthService, private eRef: ElementRef) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
