// Import necessary Angular components and libraries
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';

// Define the Angular component
@Component({
  selector: 'app-pupil-reflexes-test',
  templateUrl: './pupil-reflexes-test.component.html',
  styleUrls: ['./pupil-reflexes-test.component.css']
})
export class PupilReflexesTestComponent implements OnInit, AfterViewInit, OnDestroy {
  // Access the canvas element in the template using ViewChild
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  // Initialize private variables
  private ctx!: CanvasRenderingContext2D; // Canvas rendering context
  private mouseX = 0; // Mouse X-coordinate
  private mouseY = 0; // Mouse Y-coordinate
  private faceImage = new Image(); // Image element for the face
  private boundMouseMoveHandler: any; // Store the bound function for mousemove event

  // Define eye positions and properties
  private eyes = [
    {
      iris: { x: 190, y: 97, radius: 15 }, // Iris with smaller radius
      pupil: { x: 190, y: 97, radius: 10, targetRadius: 5 }, // Pupil properties
    },
    {
      iris: { x: 410, y: 97, radius: 15 }, // Iris with smaller radius
      pupil: { x: 410, y: 97, radius: 10, targetRadius: 5 }, // Pupil properties
    },
  ];

  // Angular lifecycle hook: OnInit
  ngOnInit(): void {
    // Load the face image and draw the scene when it's loaded
    this.faceImage.onload = () => {
      this.drawScene();
    };
    this.faceImage.src = 'assets/woman-close-up-pr.jpg'; // Set the image source
  }

  // Angular lifecycle hook: AfterViewInit
  ngAfterViewInit(): void {
    // Get the 2D rendering context of the canvas and set up mousemove event listener
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.boundMouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.canvas.nativeElement.addEventListener('mousemove', this.boundMouseMoveHandler, false);
    this.drawScene(); // Initial scene rendering
  }

  // Angular lifecycle hook: OnDestroy
  ngOnDestroy(): void {
    // Remove the mousemove event listener when the component is destroyed
    this.canvas.nativeElement.removeEventListener('mousemove', this.boundMouseMoveHandler, false);
  }

  // Handle the mousemove event
  private mouseMoveHandler(e: MouseEvent): void {
    this.mouseX = e.clientX - this.canvas.nativeElement.offsetLeft; // Adjust mouse X-coordinate
    this.mouseY = e.clientY - this.canvas.nativeElement.offsetTop; // Adjust mouse Y-coordinate
    this.setPupilTargetRadius(); // Update pupil target radius based on mouse position
    this.drawScene(); // Redraw the scene
  }

  // Calculate and set the target pupil radius based on mouse position
  private setPupilTargetRadius(): void {
    let lightInPupil = this.eyes.some(eye => {
      let dx = this.mouseX - eye.pupil.x;
      let dy = this.mouseY - eye.pupil.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      return distance < eye.pupil.radius;
    });

    for (let eye of this.eyes) {
      eye.pupil.targetRadius = lightInPupil ? 5 : 10; // Change the pupil size when light enters the pupil
    }
  }

  // Draw the entire scene
  private drawScene(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); // Clear the canvas
    this.ctx.drawImage(this.faceImage, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); // Draw the face image

    for (let eye of this.eyes) {
      // Animate the pupil size towards the target radius
      if (eye.pupil.radius < eye.pupil.targetRadius) {
        eye.pupil.radius += 0.2;
      } else if (eye.pupil.radius > eye.pupil.targetRadius) {
        eye.pupil.radius -= 0.2;
      }

      this.drawIris(eye.iris); // Draw the iris
      this.drawPupil(eye.pupil); // Draw the pupil
    }

    this.drawLightSource(); // Draw the simulated light source
  }

  // Draw the simulated light source
  private drawLightSource(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, 15, 0, Math.PI * 2);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Draw the iris
  private drawIris(iris: any): void {
    this.ctx.beginPath();
    this.ctx.arc(iris.x, iris.y, iris.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(133, 245, 155, 0.6)"; // Changing the color to green
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Draw the pupil
  private drawPupil(pupil: any): void {
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
