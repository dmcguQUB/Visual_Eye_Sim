import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  avatars = [
    'assets/Avatar/man_1.png',
    'assets/Avatar/man_2.png',
    'assets/Avatar/woman_1.png'
  ];
  showAvatars: boolean = false;
  currentAvatarIndex: number = 0;
  currentUserAvatar: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Get user data when the component initializes
    this.userService.getUserData().subscribe(user => {
      console.log(user.avatar);
      
      // Set the current avatar to the user's avatar
      this.currentUserAvatar = user.avatar || '';
    });
  }

  confirmAvatar() {
    this.selectAvatar(this.avatars[this.currentAvatarIndex]);
    this.showAvatars = false;
  }
  


  selectAvatar(avatar: string) {
    // Update avatar in backend
    this.userService.updateAvatar(avatar).subscribe(user => {
      // On successful update, set the new avatar as the current user avatar
      this.currentUserAvatar = user.avatar || '';
    });
  }


  nextAvatar() {
    if (this.currentAvatarIndex < this.avatars.length - 1) {
      this.currentAvatarIndex++;
    } else {
      this.currentAvatarIndex = 0;
    }
  }

  previousAvatar() {
    if (this.currentAvatarIndex > 0) {
      this.currentAvatarIndex--;
    } else {
      this.currentAvatarIndex = this.avatars.length - 1;
    }
  }
}
