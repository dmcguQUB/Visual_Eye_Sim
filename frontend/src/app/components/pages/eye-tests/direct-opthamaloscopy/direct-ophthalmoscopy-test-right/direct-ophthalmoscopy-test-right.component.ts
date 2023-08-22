import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-direct-ophthalmoscopy-test-right',
  templateUrl: './direct-ophthalmoscopy-test-right.component.html',
  styleUrls: ['./direct-ophthalmoscopy-test-right.component.css']
})
export class DirectOphthalmoscopyTestRightComponent  implements OnInit, AfterViewInit
{
  @ViewChild('maskSvg', { static: true })
  maskSvg!: ElementRef<SVGElement>;

  @ViewChild('maskCircle', { static: true })
  maskCircle!: ElementRef<SVGCircleElement>;

  @ViewChild('backgroundImage', { static: true })
  backgroundImage!: ElementRef<HTMLDivElement>;

  @Input() caseStudy!: CaseStudies;

  // Add variables for size and resolution
  sizeIndex = 0; // Start at the smallest size
  sizeArray = [30, 50, 70]; // Set the sizes you need
  resolution = 3; // Initial resolution
  //image to determine which iris it is
  thisEye: string = 'Right';
  otherEye: string = 'Left';

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateCirclePosition = this.updateCirclePosition.bind(this);
    document.addEventListener('mousemove', this.updateCirclePosition);
    this.adjustResolution(0); // Apply initial blur
  }

  // Add HostListener to listen for keyboard events
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default behavior

    if (event.key === 'ArrowUp') {
      this.adjustResolution(1);
    } else if (event.key === 'ArrowDown') {
      this.adjustResolution(-1);
    } else if (event.key === 'ArrowRight') {
      this.adjustSize(1);
    } else if (event.key === 'ArrowLeft') {
      this.adjustSize(-1);
    }
  }

  adjustResolution(value: number): void {
    this.resolution += value;
    if (this.resolution < 1) this.resolution = 1; // Ensure resolution doesn't go below 1

    // Update the image's blur
    const blurValue = (this.resolution - 1) * 5; // Change '5' to adjust the blur intensity per resolution step
    this.backgroundImage.nativeElement.style.filter = `blur(${blurValue}px)`;
  }

  adjustSize(value: number): void {
    this.sizeIndex += value;
    if (this.sizeIndex < 0) this.sizeIndex = 0; // Ensure sizeIndex doesn't go below 0
    if (this.sizeIndex > this.sizeArray.length - 1)
      this.sizeIndex = this.sizeArray.length - 1; // Ensure sizeIndex doesn't exceed the array length

    // Update the circle's size
    const newSize = this.sizeArray[this.sizeIndex];
    this.maskCircle.nativeElement.setAttribute('r', `${newSize}px`);
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

  // Update your handleClick() method
  handleClick(): void {
    this.thisEye = this.thisEye === 'Left' ? 'Right' : 'Left';
  
    let routeBase =
      this.thisEye === 'Right'
        ? 'direct-ophthalmoscopy-test-right/'
        : 'direct-ophthalmoscopy-test-left/';
  
    this.activatedRoute.params.subscribe((params) => {
      if (params['useCaseId']) {
        this.router.navigate([routeBase + params['useCaseId']]);
      }
    });
  }
  }


