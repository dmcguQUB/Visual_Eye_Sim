//class to show the case studies 

export class CaseStudies {
  id!:string;
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
    this.id = '';
    this.name = '';
    this.age = '';
    this.gender = '';
  this.medicalHistory='';
  this.drugInfo='';
  this.socialInfo='';
  this.familyHistory='';
  }
}

