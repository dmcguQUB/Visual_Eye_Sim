import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //now when we set a new user in login it will be set inside home component to populate the dahsboard
  user!:User;
  userProfilePicture?:string;
  constructor(private userService:UserService) {
// subscribe to user service 
    userService.userObservable.subscribe((newUser) => {
      //define user field
      this.user = newUser;
    })
   }

  ngOnInit(): void {
   this.userService.getUserData().subscribe(user => {
      this.user = user;
      this.userProfilePicture = user.avatar; // replace `avatarUrl` with the actual key of the avatar url from the User model
   })
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
