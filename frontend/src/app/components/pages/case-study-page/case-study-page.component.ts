import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-case-study-page',
  templateUrl: './case-study-page.component.html',
  styleUrls: ['./case-study-page.component.css']
})
export class CaseStudyPageComponent implements OnInit{

  caseStudy!: CaseStudies;
  //read food id from the route params. Pass useCaseService param the use case based on that ID
  constructor(activatedRoute: ActivatedRoute, useCaseService: UseCaseService){
    //subsribe to listen to params input
    activatedRoute.params.subscribe((params)=> {
      //check if params id 
      if(params['id'])
      // then set the case study to search by params ID
      this.caseStudy = useCaseService.getUseCaseById(params['id']);
    })

  }


  ngOnInit(): void {
    
  }

}
