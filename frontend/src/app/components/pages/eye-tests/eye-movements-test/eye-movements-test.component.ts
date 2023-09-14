import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
// Import interfaces
import { Eye, EyeBallOrPupil } from 'src/app/shared/interfaces/IDrawings.ts/IEye';

@Component({
  selector: 'app-eye-movements-test',
  templateUrl: './eye-movements-test.component.html',
  styleUrls: ['./eye-movements-test.component.css'],
})
export class EyeMovementsTestComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;
  backgroundImg = new Image();

  eyes: Eye[] = [
    {
      eyeball: { x: 190, y: 180, radius: 20 },
      pupil: { x: 190, y: 180, radius: 13 },
    },
    {
      eyeball: { x: 407, y: 180, radius: 20 },
      pupil: { x: 407, y: 180, radius: 13 },
    },
  ];

  private mouseMoveEvent$ = new Subject<MouseEvent>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Load a background image
    this.backgroundImg.src = 'assets/woman close up.png';
    
    // Subscribe to mouse move events with debounce and unsubscribe onDestroy
    this.mouseMoveEvent$
      .pipe(
        debounceTime(10), // Debounce time to reduce event handling frequency
        takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
      )
      .subscribe(e => this.processMouseMove(e));
  }

  ngAfterViewInit(): void {
    // Initialize the canvas context after the view is initialized
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.backgroundImg.onload = () => {
      this.draw();
    };
  }

  ngOnDestroy(): void {
    // Cleanup on component destruction
    this.destroy$.next(); // Notify observers to unsubscribe
    this.destroy$.complete(); // Complete the subject
  }

  draw(): void {
    // Draw the background image and eyes on the canvas
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      this.ctx.drawImage(
        this.backgroundImg,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      this.eyes.forEach((eye) => {
        this.drawEye(eye);
        this.drawPupil(eye.pupil);
      });
    }
  }

  drawEye(eye: Eye): void {
    if (!this.ctx) return;

    this.ctx.save(); // Save the original context
    this.ctx.beginPath();

    this.ctx.translate(eye.eyeball.x, eye.eyeball.y); // Move the context to the center of the eye
    this.ctx.scale(1.5, 1); // Scale context horizontally

    // Draw the eye. Since we have moved the context, the center is now at (0, 0)
    this.ctx.arc(0, 0, eye.eyeball.radius, 0, Math.PI * 2);

    this.ctx.restore(); // Restore the context to its original state
    this.ctx.closePath();
  }

  drawPupil(pupil: EyeBallOrPupil): void {
    if (!this.ctx) return;

    // Draw the outer circle (iris)
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'green'; // Set the color to green
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw the inner circle (pupil)
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius / 2, 0, Math.PI * 2); // Use pupil.radius / 2 to make the pupil half the size of the iris
    this.ctx.fillStyle = 'black'; // Set the color to black
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  mouseMoveHandler(e: MouseEvent): void {
    this.mouseMoveEvent$.next(e); // Forward mouse move events to the observable
  }

  private processMouseMove(e: MouseEvent): void {
    // Calculate the movement of the pupils based on mouse position
    const mouseX = e.clientX - this.canvas.nativeElement.offsetLeft;
    const mouseY = e.clientY - this.canvas.nativeElement.offsetTop;

    // Calculate a shared reference point (midpoint between the two eyes)
    const referenceX = (this.eyes[0].eyeball.x + this.eyes[1].eyeball.x) / 2;
    const referenceY = (this.eyes[0].eyeball.y + this.eyes[1].eyeball.y) / 2;

    const dx = mouseX - referenceX;
    const dy = mouseY - referenceY;

    // Calculate the distance from the reference point to the mouse
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction
    const normalizedX = dx / distance;
    const normalizedY = dy / distance;

    for (let eye of this.eyes) {
      // Calculate the max distance the pupil can move inside the eyeball
      const maxPupilDistance = eye.eyeball.radius - eye.pupil.radius;

      // If the distance is less than the eyeball's radius, let's move the pupil proportionally
      let movementDistance = distance < eye.eyeball.radius ? distance : maxPupilDistance;

      // Apply Lerp for smoother movement
      const lerpFactor = 0.9; // Adjust this value for faster/slower interpolation
      eye.pupil.x = this.lerp(eye.pupil.x, eye.eyeball.x + normalizedX * movementDistance, lerpFactor);
      eye.pupil.y = this.lerp(eye.pupil.y, eye.eyeball.y + normalizedY * movementDistance, lerpFactor);
    }

    this.draw(); // Redraw the canvas with updated pupil positions
  }

  // Linear interpolation function to allow for smooth eye movements
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }
}
