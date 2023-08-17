import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { ButtonStateService } from 'src/app/services/buttonState.service';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
//vars for propagating the user conversation
isPatientConvoFinished: boolean = false;
isEyeExaminationTestFinished: boolean = false;
isInvestigationTestFinished: boolean = false;



  caseStudy: CaseStudies = new CaseStudies(); // Set to a default value

  constructor(private activatedRoute: ActivatedRoute, private useCaseService: UseCaseService,private buttonStateService: ButtonStateService, private examStateService: ExamStateService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
          this.caseStudy = serverCaseStudy;
        }, error => {
          console.log('An error occurred:', error); // Log any errors for debugging
        });

        this.examStateService.isEyeExaminationTestFinished$.subscribe(isFinished => {
          this.isEyeExaminationTestFinished = isFinished;
        });
      }
    });
    
    //change button so user goes to examinations stage when they are finished with intro
    this.buttonStateService.currentButtonState.subscribe(state => this.isPatientConvoFinished = state);

  }

  
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;
}
