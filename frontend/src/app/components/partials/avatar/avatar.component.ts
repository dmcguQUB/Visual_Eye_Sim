import { Component, OnInit, OnDestroy } from '@angular/core';  // Import OnDestroy
import { UserService } from 'src/app/services/user.service';
import { takeUntil } from 'rxjs/operators';  // Import takeUntil operator
import { Subject } from 'rxjs';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit, OnDestroy {  // Implement OnDestroy
  avatars = [
    'assets/Avatar/man_1.png',
    'assets/Avatar/man_2.png',
    'assets/Avatar/woman_1.png'
  ];
  showAvatars: boolean = false;
  currentAvatarIndex: number = 0;
  currentUserAvatar: string = '';

  private destroy$ = new Subject<void>();  // Create a private subject to handle unsubscription


  constructor(private userService: UserService) { }

  ngOnInit() {
    //get user data when the component intialises
    this.userService.getUserData()
      .pipe(takeUntil(this.destroy$))  // Use takeUntil operator
      .subscribe(user => {
        // console.log(user.avatar);
        //get the user avatar selected
        this.currentUserAvatar = user.avatar || '';
      });
  }


  confirmAvatar() {
    this.selectAvatar(this.avatars[this.currentAvatarIndex]);
    this.showAvatars = false;
  }
  
  selectAvatar(avatar: string) {
        // Update avatar in backend
    this.userService.updateAvatar(avatar)
      .pipe(takeUntil(this.destroy$))  // Use takeUntil operator
      .subscribe(user => {
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

  ngOnDestroy() {  // OnDestroy lifecycle method
    this.destroy$.next();  // Trigger the subject's next method
    this.destroy$.complete();  // Complete the subject
  }
}
