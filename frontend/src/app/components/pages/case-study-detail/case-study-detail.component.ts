import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UseCaseService } from 'src/app/services/usecases.service';
import { ButtonStateService } from 'src/app/services/buttonState.service';
import { Observable, EMPTY, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-case-study-detail',
  templateUrl: './case-study-detail.component.html',
  styleUrls: ['./case-study-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Use OnPush change detection strategy
})
export class CaseStudyDetailComponent implements OnInit, OnDestroy {

  private subscription: Subscription | undefined;
  caseStudy$: Observable<CaseStudies> | undefined;// Use an observable for the case study data
  isButtonClicked: boolean = false;
  showButton: boolean = true;
  botpressScript!: HTMLScriptElement;

  constructor(
    private activatedRoute: ActivatedRoute,
    private useCaseService: UseCaseService,
    private buttonStateService: ButtonStateService,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    this.caseStudy$ = this.activatedRoute.params.pipe(
      switchMap(params => this.useCaseService.getUseCaseById(params['useCaseId'])),
      catchError(error => {
        console.log('An error occurred:', error);
        // Handle error gracefully (e.g., show error message to user)
        return EMPTY;
      })
    );
    this.subscription = this.caseStudy$.subscribe(() => {
      // Call the method to add the script file for the Botpress chatbot
      this.addScriptToElement("https://cdn.botpress.cloud/webchat/v0/inject.js");
      this.addScriptToElement("https://mediafiles.botpress.cloud/32e236a8-39dd-49e5-8a8d-bd9604e12cf8/webchat/config.js");
    });
  };


  addScriptToElement(src: string): HTMLScriptElement {
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this._document.body.appendChild(script);

    // Save a reference to the Botpress script so that you can remove it later if needed
    if (src === "https://cdn.botpress.cloud/webchat/v0/inject.js") {
      this.botpressScript = script;
    }

    return script;
  }

  ngOnDestroy(): void {
    // Unsubscribe from the caseStudy$ observable
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  
    // Remove the Botpress script when the component is destroyed
    if (this.botpressScript) {
      this._document.body.removeChild(this.botpressScript);
    }
  }
  
  handleClick(): void {
    this.buttonStateService.changeButtonState(true);
    this.showButton = false;
  }
}
