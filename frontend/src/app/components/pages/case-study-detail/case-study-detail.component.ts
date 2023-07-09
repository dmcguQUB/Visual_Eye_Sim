//case-study-detail.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UseCaseService } from 'src/app/services/usecases.service';


@Component({
  selector: 'app-case-study-detail',
  templateUrl: './case-study-detail.component.html',
  styleUrls: ['./case-study-detail.component.css']
})
export class CaseStudyDetailComponent implements OnInit {
  caseStudy!: CaseStudies;

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService) { }

  ngOnInit(): void {
    //locate the case study phase
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.useCaseService.getUseCaseById(params['id']).subscribe(serverCaseStudy=>{
          this.caseStudy = serverCaseStudy;

        });
      }
    });

  } }
