import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-pupil-reflexes-test',
  templateUrl: './pupil-reflexes-test.component.html',
  styleUrls: ['./pupil-reflexes-test.component.css']
})
export class PupilReflexesTestComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;  

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document:Document) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.addScriptToElement("./assets/pupil-flexes-test.js");
  }

  addScriptToElement(src: string): HTMLScriptElement {
    const script = this.renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer2.appendChild(this._document.body, script);
    return script;
  }
}
