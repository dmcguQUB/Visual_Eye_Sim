import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-visual-acuity-test',
  templateUrl: './visual-acuity-test.component.html',
  styleUrls: ['./visual-acuity-test.component.css']
})
export class VisualAcuityTestComponent implements OnInit, AfterViewInit {
  //input casestudy to navbar
  @Input() caseStudy!: CaseStudies;
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Visual Acuity Test
    this.addScriptToElement("./assets/visual-acuity-test.js");
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
