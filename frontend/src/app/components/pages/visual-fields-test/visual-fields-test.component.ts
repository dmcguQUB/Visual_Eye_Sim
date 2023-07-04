import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-visual-fields-test',
  templateUrl: './visual-fields-test.component.html',
  styleUrls: ['./visual-fields-test.component.css']
})
export class VisualFieldsTestComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Call the method to add the script file for the Visual Fields Test
    this.addScriptToElement("./assets/visual-fields-test.js");
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
