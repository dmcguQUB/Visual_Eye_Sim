import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL,USER_REGISTER_URL  } from '../shared/constants/url';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/User'; 

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject =

  //now we get the user form the local storage. If none we will get a new user object
  new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  //need the 
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    //this means the userObservable is the read only subkecy user siubject
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }


  login(userLogin:IUserLogin):Observable<User>{
    // return the http for user login
    //use pipe to show if the login was sucessful. This does not break the flow of Observable unlike a subscribe out
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        //sucessful log in
        next: (user) =>{
          //set the user into local storage first
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Visual Eye Simulation ${user.name}!`,
            'Login Successful'
          )
        },
        //unsucessful login
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  //creating user service here 
  register(userRegiser:IUserRegister): Observable<User>{
    //create HTTP request passing in the user register URL and userRegister paramater
    //pipe and tap used to show message when message successful or not
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        //Inject user
        next: (user) => {

          //set the user in local storage
          this.setUserToLocalStorage(user);
          //set the subject
          this.userSubject.next(user);
          //sucessful login message using toastr Service
          this.toastrService.success(
            `Welcome to the Visual Eye Simulation ${user.name}`,
            'Register Successful'
          )
        },
        //if error provide a message of register fail
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
  }


  //logout function
  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  //save the user  into the local storage
  private setUserToLocalStorage(user:User){
        //change the user into JSON using stringify
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  //get user from local storage
  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    //convert userJSON into a User Object
    if(userJson) return JSON.parse(userJson) as User;
    //if no user inside JSON storage return a new user
    return new User();
  }



}
