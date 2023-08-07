//case-study-detail.component.ts
import { Component, OnInit, ViewChild, Renderer2, Inject, AfterViewInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { UseCaseService } from 'src/app/services/usecases.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { DOCUMENT } from '@angular/common';
import { ButtonStateService } from 'src/app/services/buttonState.service';


@Component({
  selector: 'app-case-study-detail',
  templateUrl: './case-study-detail.component.html',
  styleUrls: ['./case-study-detail.component.css'],
})
export class CaseStudyDetailComponent implements OnInit {

  //this is a method to return an array of case studies
  caseStudy: CaseStudies = new CaseStudies();
  isButtonClicked: boolean = false;
  showButton: boolean = true;


  //botpress 
  botpressScript!: HTMLScriptElement;


  constructor(
    private activatedRoute: ActivatedRoute,
    private useCaseService: UseCaseService,
    private renderer2: Renderer2,
    private buttonStateService: ButtonStateService,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    //locate the case study phase
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(serverCaseStudy => {
          console.log('Data returned from backend:', serverCaseStudy);  // Add this
          this.caseStudy = serverCaseStudy;
          console.log('this.caseStudy after assignment:', this.caseStudy);  // And this
        }, error => {
          console.log('An error occurred:', error); // Log any errors for debugging
        });
      
      }
    });
  
  }
  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Botpress chatbot
    this.addScriptToElement("https://cdn.botpress.cloud/webchat/v0/inject.js");
    this.addScriptToElement("https://mediafiles.botpress.cloud/32e236a8-39dd-49e5-8a8d-bd9604e12cf8/webchat/config.js");
  }

  //define add to script for botpress
  addScriptToElement(src: string): HTMLScriptElement {
    const script = this.renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer2.appendChild(this._document.body, script);
  
    // Save a reference to the Botpress script so that you can remove it later if needed
    if (src === "https://cdn.botpress.cloud/webchat/v0/inject.js") {
      this.botpressScript = script;
    }
  
    return script;
  }

  //destory after changing page to prevent performance issues
  ngOnDestroy(): void {
    // Remove the Botpress script when the component is destroyed
    if (this.botpressScript) {
      this.renderer2.removeChild(this._document.body, this.botpressScript);
    }
  }
//button to check if the user has finsihed with the first stage to unlock further investiagation features
  handleClick(): void {
    this.buttonStateService.changeButtonState(true);
    this.showButton = false;  // Set the showButton variable to false when the button is clicked
  }
  
  
}
