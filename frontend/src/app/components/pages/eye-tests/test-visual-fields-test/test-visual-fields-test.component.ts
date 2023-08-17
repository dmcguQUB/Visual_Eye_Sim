import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-test-visual-fields-test',
  templateUrl: './test-visual-fields-test.component.html',
  styleUrls: ['./test-visual-fields-test.component.css'],
})
export class TestVisualFieldsTestComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private face = { x: 0, y: 0, radiusX: 0, radiusY: 0, rotation: 0 };
  private eyes: any[] = [];
  private rectangles: any[] = [];

  //create hand image var
  handImage: any;
  //image to determine which eye it is
  thisEye: string = 'Left';
  otherEye: string = 'Right';
  caseStudy = new CaseStudies();
  // Add new property for the message
  buttonMessage: string = '';

  constructor(
    private renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private useCaseService: UseCaseService // Inject UseCaseService
  ) {}

  ngOnInit(): void {
    //load image as soon as it is created
    this.handImage = new Image();
    this.handImage.src = 'assets/Left-hand.png';

    // Fetch the caseStudy
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      if (params['useCaseId']) {
        this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(
          (serverCaseStudy) => {
            this.caseStudy = serverCaseStudy;
          },
          (error) => {
            console.log('An error occurred:', error); // Log any errors for debugging
          }
        );
      }
    });
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context !== null) {
      this.ctx = context;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      canvas.addEventListener(
        'mousemove',
        this.mouseMoveHandler.bind(this),
        false
      );

      this.face = {
        x: canvas.width / 2,
        y: 400,
        radiusX: 300,
        radiusY: 300,
        rotation: 0,
      };

      this.eyes = [
        {
          eyeball: { x: canvas.width / 2 - 100, y: 200, radius: 50 },
          pupil: {
            x: canvas.width / 2 - 100,
            y: 200,
            radius: 20,
            targetRadius: 20,
          },
        },
        {
          eyeball: { x: canvas.width / 2 + 100, y: 200, radius: 50 },
          pupil: {
            x: canvas.width / 2 + 100,
            y: 200,
            radius: 20,
            targetRadius: 20,
          },
        },
      ];

      this.rectangles = [
        {
          x: 20,
          y: 20,
          width: canvas.width / 2,
          height: canvas.height / 2,
          fill: 'rgba(0, 0, 255, 0.5)',
        },
        {
          x: canvas.width / 2 + 20,
          y: 20,
          width: canvas.width / 2,
          height: canvas.height / 2,
          fill: 'rgba(0, 0, 255, 0.5)',
        },
        {
          x: 20,
          y: canvas.height / 2 + 20,
          width: canvas.width / 2,
          height: canvas.height / 2,
          fill: 'rgba(0, 0, 255, 0.5)',
        },
        {
          x: canvas.width / 2 + 20,
          y: canvas.height / 2 + 20,
          width: canvas.width / 2,
          height: canvas.height / 2,
          fill: 'rgba(0, 0, 255, 0.5)',
        },
      ];

      window.requestAnimationFrame(this.animation.bind(this));
    } else {
      console.error('2D context not available');
    }
  }

  mouseMoveHandler(event: MouseEvent) {
    const rect = this.myCanvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.rectangles.forEach((rect) => {
      rect.fill = 'rgba(0, 0, 255, 0.5)';
      if (
        mouseX > rect.x &&
        mouseX < rect.x + rect.width &&
        mouseY > rect.y &&
        mouseY < rect.y + rect.height
      ) {
        rect.fill = 'rgba(255, 0, 0, 0.5)';
      }
    });
  }

  animation() {
    this.ctx.clearRect(
      0,
      0,
      this.myCanvas.nativeElement.width,
      this.myCanvas.nativeElement.height
    );

    this.rectangles.forEach((rect) => this.drawRectangle(rect));
    this.drawFace(this.face);
    this.eyes.forEach((eye) => {
      if (eye.pupil.radius < eye.pupil.targetRadius) {
        eye.pupil.radius += 0.004;
      } else if (eye.pupil.radius > eye.pupil.targetRadius) {
        eye.pupil.radius -= 0.004;
      }

      this.drawEye(eye.eyeball);
      this.drawPupil(eye.pupil);
    });

    window.requestAnimationFrame(this.animation.bind(this));
  }

  drawRectangle(rect: any) {
    this.ctx.fillStyle = rect.fill;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  drawFace(face: any) {
    this.ctx.beginPath();
    this.ctx.ellipse(
      face.x,
      face.y,
      face.radiusX,
      face.radiusY,
      face.rotation,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawEye(eye: any) {
    this.ctx.beginPath();
    this.ctx.arc(eye.x, eye.y, eye.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // black color
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawPupil(pupil: any) {
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // black color
    this.ctx.fill(); // fill in pupil
    this.ctx.stroke();
    this.ctx.closePath();
  }

  //determine the eye it is so can change the text in button dynamically
  // Update your handleClick() method
  handleClick(): void {
    this.thisEye = this.thisEye === 'Left' ? 'Right' : 'Left';

    if (this.thisEye === 'Left') {
      // No navigation specified for 'Left' eye
    } else {
      this.activatedRoute.params.subscribe((params) => {
        if (params['useCaseId']) {
          this.router.navigate([
            `/visual-fields-test-right/${params['useCaseId']}`,
          ]);
        }
      });
    }
  }
  handleButtonClick(buttonId: string): void {
    this.buttonMessage = buttonId + ' clicked!';
  }

  ngOnDestroy(): void {
    // <-- Add OnDestroy lifecycle hook
    // Remove the script when the component is destroyed
    // Call cleanup function from visual-fields-test-left.js
    if (window['cleanup']) {
      window['cleanup']();
    }
  }
}
