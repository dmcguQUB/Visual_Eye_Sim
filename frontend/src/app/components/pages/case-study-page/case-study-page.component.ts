// case-study-page.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/models/casestudies';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-case-study-page',
  templateUrl: './case-study-page.component.html',
  styleUrls: ['./case-study-page.component.css']
})
export class CaseStudyPageComponent implements OnInit {
  caseStudy!: CaseStudies;

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
          this.caseStudy = serverCaseStudy;
        });
      }
    });
  }
  
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;

}
