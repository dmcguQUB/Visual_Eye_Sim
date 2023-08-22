// check if the logged-in user is an admin before they can navigate to certain routes.
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService:UserService, private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // If currentUser is an observable, we handle it, otherwise, we proceed with the initial logic
    if (typeof this.userService.currentUser === 'object' && this.userService.currentUser instanceof Observable) {
      return this.userService.currentUser.pipe(
        map(user => {
          if (user.isAdmin) return true;

          this.router.navigate(['/']);
          return false;
        }),
        catchError(() => {
          this.router.navigate(['/']);
          return of(false);
        })
      );
    } else {
      if (this.userService.currentUser.isAdmin) return true;
      
      this.router.navigate(['/']);
      return false;
    }
  }
}
