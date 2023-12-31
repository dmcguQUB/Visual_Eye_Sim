import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs'; // Import Subscription for managing subscriptions


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy { // Implement OnDestroy
  //angular forms used
  loginForm!:FormGroup;
  //indicator if the user has submitted form yet. Set to false so errors don't show until form submitted
  isSubmitted = false;
  returnUrl = '';
  private subscription: Subscription = new Subscription(); // Create a Subscription object to hold our subscriptions


  //use Form builder from angular, inject user servuce
  constructor(
    private formBuilder: FormBuilder, 
    private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {
    //login form is used for the form builder
    this.loginForm = this.formBuilder.group({
      //adding validators so email is required and it will check the format of the email
      email:['', [Validators.required,Validators.email]],
      //check the password 
      password:['', Validators.required]
    });

    //returned URL is the same as snapshot (e.g. most recent no need to subscribe) query params is eveything after
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  //this simlifies code so we only have to use fc.email to access it instead of loginForm.controls.email
  get fc(){
    return this.loginForm.controls;
  }

  //submit button
  submit(){
    //set is submitted button to true
    this.isSubmitted = true;
    //if invalid login form return this
    if(this.loginForm.invalid) return;

    //send the email and password to the userservice
    const loginSub = this.userService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });

    this.subscription.add(loginSub); // Add this subscription to our Subscription object
  }

  //destroy component after leaving component
  ngOnDestroy(): void { // Implement ngOnDestroy lifecycle hook
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions to prevent memory leaks
  }

}
