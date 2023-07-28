
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-visual-fields-test-left',
  templateUrl: './visual-fields-test-left.component.html',
  styleUrls: ['./visual-fields-test-left.component.css'],
})
export class VisualFieldsTestLeftComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

      // Store a reference to the script element
      private script!: HTMLScriptElement;

  //create hand image var
  handImage: any;
  //image to determine which eye it is 
  thisEye: string = 'Left';
  otherEye: string = 'Right';
  caseStudy = new CaseStudies;

  constructor(
    private renderer2: Renderer2,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private useCaseService: UseCaseService,  // Inject UseCaseService
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    //load image as soon as it is created
    this.handImage = new Image();
    this.handImage.src = 'assets/Left-hand.png';
  
    // Fetch the caseStudy
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
  

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Visual Fields Test
    this.addScriptToElement(
      'http://localhost:5001/assets/visual-fields-test-left.js'
    );
  }

  addScriptToElement(src: string): HTMLScriptElement {
    // Create a new script element
    const script = this.renderer2.createElement('script');

    // Set the script properties
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;

    // Append the script to the document body
    this.renderer2.appendChild(this._document.body, script);
    this.script = script; // Store the script reference
    return script;
  }

  //determine the eye it is so can change the text in button dynamically
  // Update your handleClick() method
handleClick(): void {
  this.thisEye = this.thisEye === 'Left' ? 'Right' : 'Left';
  
  if(this.thisEye === 'Left') {
    // No navigation specified for 'Left' eye
  } else {
    this.activatedRoute.params.subscribe(params => {
      if (params['useCaseId']) {
        this.router.navigate([`/visual-fields-test-right/${params['useCaseId']}`]);
      }
    });
  }
}
ngOnDestroy(): void {  // <-- Add OnDestroy lifecycle hook
  // Remove the script when the component is destroyed


  console.log("the ngOnDetroy is being called")

  this.renderer2.removeChild(this._document.body, this.script);
  
}
}
