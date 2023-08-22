import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs'; // Import Subject
import { takeUntil } from 'rxjs/operators'; // Import takeUntil

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Implement OnDestroy

  //now when we set a new user in login it will be set inside home component to populate the dahsboard
  user!: User;
  userProfilePicture?: string;

  private destroy$ = new Subject<void>(); // Subject that'll emit once when component is destroyed


  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
        // Fetch user data once at initialization
    this.userService.getUserData()
    .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
    .subscribe(user => {
      this.user = user;
      this.userProfilePicture = user.avatar; 
      this.cd.detectChanges(); // use detect changes to invoke so you don't have to refresh page
    });

    // Continue listening for any updates to the user data
    this.userService.userObservable
    .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
    .subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emitting a value to cause all active subscriptions to unsubscribe
    this.destroy$.complete(); // Completing the subject
  }

  //get access to logout service
  logout() {
    this.userService.logout();
  }

  //make name for if user is logged in more meaningful
  get isAuth() {
    return this.user.token;
  }

  //check if ther user is admin
  get isAdmin() {
    return this.user.isAdmin;
  }
}
