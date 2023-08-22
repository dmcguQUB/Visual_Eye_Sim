//interface required for registering a user. Define data we need to get from API on server side
export interface IUserRegister{
  name : string;
  email : string;
  password : string;
  confirmPassword : string;
  address: string;
}
