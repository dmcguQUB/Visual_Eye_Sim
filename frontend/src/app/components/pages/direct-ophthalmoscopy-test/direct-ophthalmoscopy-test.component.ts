import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CaseStudies } from 'src/app/shared/models/casestudies'; // Assuming the model is placed here

@Component({
  selector: 'app-direct-ophthalmoscopy-test',
  templateUrl: './direct-ophthalmoscopy-test.component.html',
  styleUrls: ['./direct-ophthalmoscopy-test.component.css']
})
export class DirectOphthalmoscopyTestComponent implements OnInit, AfterViewInit {
  // Obtain a reference to the canvas element
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  @Input() caseStudy!: CaseStudies;

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Direct Ophthalmoscopy Test
    this.addScriptToElement("./assets/direct-ophthalmoscopy-test.js");
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
