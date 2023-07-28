import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-pupil-reflexes-test',
  templateUrl: './pupil-reflexes-test.component.html',
  styleUrls: ['./pupil-reflexes-test.component.css']
})
export class PupilReflexesTestComponent implements OnInit, AfterViewInit {
  //input casestudy to navbar
  @Input() caseStudy!: CaseStudies;
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  private scriptElement: HTMLScriptElement | null = null; // Add a property to store a reference to the script element


  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document:Document) { }

  

  addScriptToElement(src: string): HTMLScriptElement {
    const script = this.renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer2.appendChild(this._document.body, script);
    this.scriptElement = script; // Store a reference to the script element
    return script;
  }
  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.addScriptToElement("http://localhost:5001/assets/pupil-reflexes-test.js");
  }

  //destory the script after navigating to stop bugs while navigating across pages
  ngOnDestroy(): void {


    console.log("the ngOnDetroy is being called")
    // When the component is destroyed, remove the script element
    if (this.scriptElement) {
      this.renderer2.removeChild(this._document.body, this.scriptElement);
    }
  }
}
