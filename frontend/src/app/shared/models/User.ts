export class User{
  _id?:string;
  email!:string;
  name!:string;
  address!:string;
  token!:string;
  isAdmin!:boolean;
  avatar?: string;  // Add this line
}
