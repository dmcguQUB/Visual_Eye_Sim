import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core'; // Import OnDestroy
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs'; // Import Subscription
import { ButtonStateService } from 'src/app/services/buttonState.service';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy { // Implement OnDestroy
  //vars for propagating the user conversation
  isPatientConvoFinished: boolean = false;
  isEyeTestFinished: boolean = false;
  isInvestigationsTestFinished: boolean = false;

  caseStudy: CaseStudies = new CaseStudies(); // Set to a default value

  private subscriptions: Subscription[] = []; // Array to store multiple subscriptions

  constructor(
    private activatedRoute: ActivatedRoute,
    private useCaseService: UseCaseService,
    private buttonStateService: ButtonStateService,
    private examStateService: ExamStateService
  ) { }

  ngOnInit(): void {
    // Store the subscription
    this.subscriptions.push(
      //find the case study
      this.activatedRoute.params.subscribe(params => {
        console.log(params);
        if (params['useCaseId']) {
          this.subscriptions.push(
            this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
              this.caseStudy = serverCaseStudy;
            }, error => {
              console.log('An error occurred:', error);
            })
          );
          //see if eye test is finished
          this.subscriptions.push(
            this.examStateService.isEyeTestFinished$.subscribe(isFinished => {
              this.isEyeTestFinished = isFinished;
            })
          );
          //see if investigations finished
          this.subscriptions.push(
            this.examStateService.isInvestigationsTestFinished$.subscribe(isFinished => {
              this.isInvestigationsTestFinished = isFinished;
            })
          );
        }
      })
    );
    //change the button state for the background info once the user is finished speaking with patient
    this.subscriptions.push(
      this.buttonStateService.currentButtonState.subscribe(state => this.isPatientConvoFinished = state)
    );
  }

  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}
