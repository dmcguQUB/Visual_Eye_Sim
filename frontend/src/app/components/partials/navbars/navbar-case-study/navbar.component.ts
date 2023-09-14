import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonStateService } from 'src/app/services/buttonState.service';
import { ExamStateService } from 'src/app/services/examStateService.service';
import { PatientConvoStateService } from 'src/app/services/patient-convo-state.service';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isPatientConvoFinished: boolean = false;
  isEyeTestFinished: boolean = false;
  isInvestigationsTestFinished: boolean = false;

  caseStudy: CaseStudies = new CaseStudies();

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private useCaseService: UseCaseService,
    private buttonStateService: ButtonStateService,
    private examStateService: ExamStateService,
    private patientConvoStateService: PatientConvoStateService

  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {
        if (params['useCaseId']) {
          const useCaseId = params['useCaseId'];

          this.subscriptions.push(
            this.useCaseService.getUseCaseById(useCaseId).subscribe(serverCaseStudy => {
              this.caseStudy = serverCaseStudy;
            }, error => {
              console.log('An error occurred:', error);
            })
          );

          // Modified the following two subscriptions to use the useCaseId
          this.subscriptions.push(
            this.examStateService.isEyeTestFinished$(useCaseId).subscribe(isFinished => {
              this.isEyeTestFinished = isFinished;
            })
          );

          this.subscriptions.push(
            this.examStateService.isInvestigationsTestFinished$(useCaseId).subscribe(isFinished => {
              this.isInvestigationsTestFinished = isFinished;
            })
          );
        }
      })
    );

    this.subscriptions.push(
      this.buttonStateService.currentButtonState.subscribe(state => this.isPatientConvoFinished = state)
    );

    this.subscriptions.push(
      this.patientConvoStateService.isPatientConvoFinished$.subscribe(isFinished => {
        this.isPatientConvoFinished = isFinished;
      }))
  }

  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
