//usecases.services.ts
import { Injectable } from '@angular/core';
import { sample_case_studies } from 'src/data';
import { CaseStudies } from '../shared/models/casestudies';

@Injectable({
  providedIn: 'root'
})
export class UseCaseService {

  constructor() { }

  //get all use cases array
  getAll(): CaseStudies[] {
    return sample_case_studies;
  }

  //create a page for usecase when you click into it
  getUseCaseById(useCaseId:string):CaseStudies{
    //if returns null then returns a new case study
    return this.getAll().find(caseStudy => caseStudy.id == useCaseId) ?? new CaseStudies();
  }
}

