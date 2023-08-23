//frontend/src/app/components/partials/buttons/login-button.component.ts
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core'; // Import ChangeDetectionStrategy
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <!-- Use the logout method instead of directly accessing the document property -->
      <button class="auth-button btn-logout" (click)="logout()">
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button class="auth-button btn-login" (click)="auth.loginWithRedirect()">Log in</button>
    </ng-template>
  `,
  styles: [`
    .auth-button {
      padding: 1rem;
      display: block;
      text-decoration: none;
      border-radius: 15px;
      transition: background-color 0.3s;
      color: #fff;
      border: none;
      margin-bottom: 1rem;
    }
    .btn-login {
      background-color: #9c88ff;
    }
    .btn-login:hover {
      background-color: #7b6feb;
    }
    .btn-logout {
      background-color: #e9ecef;
      color: #495057;
    }
    .btn-logout:hover {
      background-color: #caccd1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush  // Use OnPush change detection
})
export class AuthButtonComponent {
  constructor(@Inject(DOCUMENT) private document: Document, public auth: AuthService) {}

  logout() {
    const returnTo = this.document.location.origin;
    this.auth.logout({ logoutParams: { returnTo } });
  }
}
