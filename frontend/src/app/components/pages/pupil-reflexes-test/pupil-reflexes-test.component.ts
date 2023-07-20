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

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document:Document) { }

  

  addScriptToElement(src: string): HTMLScriptElement {
    const script = this.renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer2.appendChild(this._document.body, script);
    return script;
  }
  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.addScriptToElement("http://localhost:5001/assets/pupil-reflexes-test.js");
  }
}
