//backend/src/items/case-study.interface.ts
export interface BaseCaseStudy {
  name: string,
  imageUrl: string,
  age: string,
  gender: string,
  medicalHistory: string,
  drugInfo: string,
  socialInfo: string,
  familyHistory: string
}

export interface CaseStudy extends BaseCaseStudy {
  id: number;
}
