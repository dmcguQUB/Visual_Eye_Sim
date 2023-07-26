//class to show the case studies 
//frontend/src/app/shared/models/casestudies.ts 
export class CaseStudies {
  _id!:string;
  caseStudyNumber!:number;
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
    this._id = '',
    this.caseStudyNumber=-1,
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

