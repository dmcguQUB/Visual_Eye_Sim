import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/ILoginAndRegistration/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator'; // extra validator to see if both passwords when registering match
import { Subscription } from 'rxjs'; // Import Subscription to handle observables

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  // Implement OnDestroy

  //take Form group from angular
  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  private subscription: Subscription = new Subscription(); // Initialize a Subscription to handle observables

  //form builder helps to build form group. Need user service for register method.
  //Activated route required to get URL and router to return return URL when register finished
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //build register form using form builder
    this.registerForm = this.formBuilder.group(
      {
        //a;; contain the validators
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required],
        address: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        //compare both passwords are the same when registering
        validators: PasswordsMatchValidator('password', 'confirmPassword'),
      }
    );

    //return the returnUrl from the queryParams
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  //function to get function to get the controls required for register form
  get fc() {
    return this.registerForm.controls;
  }

  //submit method
  submit() {
    //change isSubmited to true
    this.isSubmitted = true;
    //check if the register form is invalid. Return to prevent anything invalid sent to the server
    if (this.registerForm.invalid) return;

    //want to get values of all fields in register form
    const fv = this.registerForm.value;
    //now add values to user object
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address,
    };

    //pass user to the register user service and subscribe to it returning to the return URL
    const registerSub = this.userService.register(user).subscribe((_) => {
      this.router.navigateByUrl(this.returnUrl);
    });

    this.subscription.add(registerSub); // Add subscription to our main subscription
  }

  ngOnDestroy(): void { // Cleanup subscriptions when the component is destroyed
    this.subscription.unsubscribe();
  }
}
