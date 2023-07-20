// Import necessary dependencies
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-eye-movements-test',
  templateUrl: './eye-movements-test.component.html',
  styleUrls: ['./eye-movements-test.component.css']
})
export class EyeMovementsTestComponent implements OnInit, AfterViewInit {
   //input casestudy to navbar
   @Input() caseStudy!: CaseStudies;
  // Obtain a reference to the canvas element
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Eye Movements Test. This is now served from the backend to prevent the user from seeing the test
    this.addScriptToElement("http://localhost:5001/assets/eye-movements-test.js");
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

    return script;
  }

}
