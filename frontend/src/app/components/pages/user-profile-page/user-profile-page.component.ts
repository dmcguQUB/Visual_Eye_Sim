import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { takeUntil } from 'rxjs/operators';  // Import takeUntil


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent  implements OnInit {
  currentUser!: User;

  // Variables to manage the edit mode of Name and Address
  isNameEditMode: boolean = false;
  isAddressEditMode: boolean = false;

  // Temporary holders for values during edit mode
  tempName: string = '';
  tempAddress: string = '';

  //create to destroy all subscriptions
  private destroy$: Subject<boolean> = new Subject<boolean>();  // Subject to manage component's observables


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUser;
    this.tempName = this.currentUser.name;
    this.tempAddress = this.currentUser.address;
  }

  // Name section methods
  toggleNameEditMode(): void {
    this.isNameEditMode = !this.isNameEditMode;
    this.tempName = this.currentUser.name;
  }

  saveName(): void {
    this.userService.updateName(this.tempName)
      .pipe(takeUntil(this.destroy$))  // Unsubscribe when component is destroyed
      .subscribe((updatedUser) => {
        this.currentUser.name = updatedUser.name;
        this.isNameEditMode = false;
      });
  }

  cancelNameEdit(): void {
    this.isNameEditMode = false;
  }

  // Address section methods
  toggleAddressEditMode(): void {
    this.isAddressEditMode = !this.isAddressEditMode;
    this.tempAddress = this.currentUser.address;
  }

  saveAddress(): void {
    this.userService.updateAddress(this.tempAddress)
      .pipe(takeUntil(this.destroy$))  // Unsubscribe when component is destroyed
      .subscribe((updatedUser) => {
        this.currentUser.address = updatedUser.address;
        this.isAddressEditMode = false;
      });
  }


  cancelAddressEdit(): void {
    this.isAddressEditMode = false;
  }

  ngOnDestroy(): void {  // OnDestroy lifecycle hook to complete the Subject, thus unsubscribing from observables
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
  


