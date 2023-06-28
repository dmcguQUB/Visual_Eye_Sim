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
}
