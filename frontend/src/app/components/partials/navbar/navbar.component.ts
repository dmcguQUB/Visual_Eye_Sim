import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/models/casestudies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  caseStudy: CaseStudies = new CaseStudies(); // Set to a default value

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
          this.caseStudy = serverCaseStudy;
        }, error => {
          console.log('An error occurred:', error); // Log any errors for debugging
        });
      }
    });
  }
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;
}
