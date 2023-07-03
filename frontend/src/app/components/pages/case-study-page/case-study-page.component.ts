//case-study-page.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-case-study-page',
  templateUrl: './case-study-page.component.html',
  styleUrls: ['./case-study-page.component.css']
})
export class CaseStudyPageComponent implements OnInit {
  caseStudy!: CaseStudies;
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;  // add ! here

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.caseStudy = this.useCaseService.getUseCaseById(params['id']);
      }
    });
  }
}
