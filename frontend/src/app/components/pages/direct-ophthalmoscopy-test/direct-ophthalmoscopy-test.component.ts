import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { CaseStudies } from 'src/app/shared/models/casestudies'; 

@Component({
  selector: 'app-direct-ophthalmoscopy-test',
  templateUrl: './direct-ophthalmoscopy-test.component.html',
  styleUrls: ['./direct-ophthalmoscopy-test.component.css']
})
export class DirectOphthalmoscopyTestComponent implements OnInit, AfterViewInit {
  @ViewChild('maskSvg', { static: true })
  maskSvg!: ElementRef<SVGElement>;

  @ViewChild('maskCircle', { static: true })
  maskCircle!: ElementRef<SVGCircleElement>;  

  @Input() caseStudy!: CaseStudies;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.updateCirclePosition = this.updateCirclePosition.bind(this);
    document.addEventListener('mousemove', this.updateCirclePosition);
  }

  updateCirclePosition(e: MouseEvent): void {
    // Get the bounding rectangle of the SVG.
    const svgRect = this.maskSvg.nativeElement.getBoundingClientRect();

    // Calculate the mouse position relative to the SVG.
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    // Update the circle's position.
    this.maskCircle.nativeElement.setAttribute('cx', `${x}px`);
    this.maskCircle.nativeElement.setAttribute('cy', `${y}px`);
  }
}
