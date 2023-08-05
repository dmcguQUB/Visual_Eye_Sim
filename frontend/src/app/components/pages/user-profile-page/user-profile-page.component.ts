import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent  implements OnInit {

  currentUser!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUser;
  }

  

}
