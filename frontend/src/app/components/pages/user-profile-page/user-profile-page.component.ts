import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { takeUntil } from 'rxjs/operators';  // Import takeUntil
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // adding validators to code


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
// create forms for validators
profileForm: FormGroup = new FormGroup({});

//create constructor
constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUser;

    // Initialize the form
    this.profileForm = this.formBuilder.group({
      name: [this.currentUser.name, [Validators.required, Validators.minLength(3)]],
      address: [this.currentUser.address, [Validators.required, Validators.minLength(5)]]
    });
}


  // Name section methods
  toggleNameEditMode(): void {
    this.isNameEditMode = !this.isNameEditMode;
    this.tempName = this.currentUser.name;
  }

  saveName(): void {
    if (this.profileForm.get('name')?.invalid) return;

    this.userService.updateName(this.profileForm.get('name')?.value)
      .pipe(takeUntil(this.destroy$))
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
    if (this.profileForm.get('address')?.invalid) return;

    this.userService.updateAddress(this.profileForm.get('address')?.value)
      .pipe(takeUntil(this.destroy$))
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
  


