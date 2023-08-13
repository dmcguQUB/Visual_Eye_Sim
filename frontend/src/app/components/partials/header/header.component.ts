import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //now when we set a new user in login it will be set inside home component to populate the dahsboard
   
user!: User;
userProfilePicture?: string;

constructor(private userService: UserService, private cd: ChangeDetectorRef) { }

ngOnInit(): void {
  // Fetch user data once at initialization
  this.userService.getUserData().subscribe(user => {
    this.user = user;
    this.userProfilePicture = user.avatar; 
    this.cd.detectChanges();// use detect changes to invoke so you don't have to refresh page
  });

  // Continue listening for any updates to the user data
  this.userService.userObservable.subscribe((newUser) => {
    this.user = newUser;
  });
}

  //get access to logout service
  logout(){
    this.userService.logout();
  }

  //make name for if user is logged in more meaningful
  get isAuth(){
    return this.user.token;
  }

  //check if ther user is admin
  get isAdmin(){
    return this.user.isAdmin;
  }
}
