//case-study-detail.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UseCaseService } from 'src/app/services/usecases.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-case-study-detail',
  templateUrl: './case-study-detail.component.html',
  styleUrls: ['./case-study-detail.component.css'],
})
export class CaseStudyDetailComponent implements OnInit {

  //this is a method to return an array of case studies
  caseStudy: CaseStudies = new CaseStudies();

  constructor(
    private activatedRoute: ActivatedRoute,
    private useCaseService: UseCaseService
  ) {}

  ngOnInit(): void {
    //locate the case study phase
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
          console.log('Data returned from backend:', serverCaseStudy);  // Add this
          this.caseStudy = serverCaseStudy;
          console.log('this.caseStudy after assignment:', this.caseStudy);  // And this
        }, error => {
          console.log('An error occurred:', error); // Log any errors for debugging
        });
      
      }
    });
  }
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;
}
