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
  // ViewChild decorators to access elements in the template
  @ViewChild('maskSvg', { static: true })
  maskSvg!: ElementRef<SVGElement>;

  @ViewChild('maskCircle', { static: true })
  maskCircle!: ElementRef<SVGCircleElement>;

  @ViewChild('backgroundImage', { static: true })
  backgroundImage!: ElementRef<HTMLDivElement>;

  @Input() caseStudy!: CaseStudies;

  // Variables for controlling size and resolution
  sizeIndex = 0; // Start at the smallest size
  sizeArray = [30, 50, 70]; // Set the available sizes
  resolution = 3; // Initial resolution

  // Variables to determine which eye is being tested
  thisEye: string = 'Right'; // Initialize as 'Right' for the right eye
  otherEye: string = 'Left'; // The other eye is 'Left'

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Bind the updateCirclePosition method to this instance of the component
    this.updateCirclePosition = this.updateCirclePosition.bind(this);

    // Listen for mousemove events to update the circle's position
    document.addEventListener('mousemove', this.updateCirclePosition);

    // Apply initial blur
    this.adjustResolution(0);
  }

  // HostListener to handle keyboard events
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default keyboard behavior

    // Adjust resolution and size based on arrow key inputs
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

  // Function to adjust the resolution (blur intensity)
  adjustResolution(value: number): void {
    this.resolution += value;

    // Ensure resolution doesn't go below 1
    if (this.resolution < 1) this.resolution = 1;

    // Calculate blur intensity based on resolution
    const blurValue = (this.resolution - 1) * 5; // Adjust the blur intensity per resolution step
    this.backgroundImage.nativeElement.style.filter = `blur(${blurValue}px)`;
  }

  // Function to adjust the size of the circle
  adjustSize(value: number): void {
    this.sizeIndex += value;

    // Ensure sizeIndex doesn't go below 0
    if (this.sizeIndex < 0) this.sizeIndex = 0;

    // Ensure sizeIndex doesn't exceed the array length
    if (this.sizeIndex > this.sizeArray.length - 1)
      this.sizeIndex = this.sizeArray.length - 1;

    // Update the circle's size based on the selected size index
    const newSize = this.sizeArray[this.sizeIndex];
    this.maskCircle.nativeElement.setAttribute('r', `${newSize}px`);
  }

  // Function to update the circle's position based on mouse movement
  updateCirclePosition(e: MouseEvent): void {
    // Get the bounding rectangle of the SVG.
    const svgRect = this.maskSvg.nativeElement.getBoundingClientRect();

    // Calculate the mouse position relative to the SVG.
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    // Update the circle's position using SVG attributes
    this.maskCircle.nativeElement.setAttribute('cx', `${x}px`);
    this.maskCircle.nativeElement.setAttribute('cy', `${y}px`);
  }

  // Function to handle button click (change tested eye and navigate to the corresponding route)
  handleClick(): void {
    this.thisEye = this.thisEye === 'Left' ? 'Right' : 'Left'; // Toggle between 'Left' and 'Right' eyes
  
    // Determine the route base based on the tested eye
    let routeBase =
      this.thisEye === 'Right'
        ? 'direct-ophthalmoscopy-test-right/'
        : 'direct-ophthalmoscopy-test-left/';
  
    // Get the useCaseId from the route parameters and navigate to the appropriate route
    this.activatedRoute.params.subscribe((params) => {
      if (params['useCaseId']) {
        this.router.navigate([routeBase + params['useCaseId']]);
      }
    });
  }
}
