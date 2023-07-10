import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  caseStudy!: CaseStudies;

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      if (params['id']) {
        this.useCaseService.getUseCaseById(params['id']).subscribe(serverCaseStudy => {
          this.caseStudy = serverCaseStudy;
        });
      }
    });
  }
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;


}
