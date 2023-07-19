import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-nav-bar-tab',
  templateUrl: './nav-bar-tabs.component.html',
})
export class NavBarTabComponent {

  isAuthenticated$ = this.authService.isAuthenticated$;
  constructor(private authService: AuthService) {}
}