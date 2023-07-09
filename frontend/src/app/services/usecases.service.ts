//usecases.services.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sample_case_studies } from 'src/data';
import { CaseStudies } from '../shared/models/casestudies';
import { CASE_STUDIES_URL } from '../shared/models/constants/url';

@Injectable({
  providedIn: 'root'
})
export class UseCaseService {

  constructor(private http:HttpClient) { }

  //get all use cases array. Using observable to throw error if there is an issue
  getAll(): Observable<CaseStudies[]> {
    //use http module with get the case studies array using the case study url
    return this.http.get<CaseStudies[]>(CASE_STUDIES_URL);
  }

  //create a page for usecase when you click onto it. You only need a type of CaseStudy it is not an array type
  getUseCaseById(useCaseId:string):Observable<CaseStudies>{
    //search use case by id 
    return this.http.get<CaseStudies>(CASE_STUDIES_URL+ "/"+useCaseId);

  }
}

