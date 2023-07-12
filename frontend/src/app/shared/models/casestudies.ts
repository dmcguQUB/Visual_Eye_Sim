//class to show the case studies 
//frontend/src/app/shared/models/casestudies.ts 
export class CaseStudies {
  id!:number;
  name!:string;
  imageUrl!: string;
  age!: string;
  gender!:string;
  medicalHistory!:string;
  drugInfo!: string;
  socialInfo!: string;
  familyHistory!: string;

  //intialise incase a empty value is found within the search
  constructor() {
    this.id = 0;
    this.name = '';
    this.imageUrl ='';
    this.age = '';
    this.gender = '';
  this.medicalHistory='';
  this.drugInfo='';
  this.socialInfo='';
  this.familyHistory='';
  }
}

