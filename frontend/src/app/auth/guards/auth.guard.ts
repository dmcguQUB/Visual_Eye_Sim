//AuthGuard: This file creates a route guard that prevents navigation to certain routes if the user isn't authenticated. If a non-authenticated user tries to navigate to a protected route, they are redirected to the login page.
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    // Check if currentUser is an observable, and handle it. Otherwise, proceed with the initial logic.
    if (typeof this.userService.currentUser === 'object' && this.userService.currentUser instanceof Observable) {
      return this.userService.currentUser.pipe(
        map(user => {
          if (user.token) return true;

          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }),
        catchError(() => {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        })
      );
    } else {
      if (this.userService.currentUser.token) return true;
      
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
