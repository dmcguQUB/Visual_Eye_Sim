import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

interface Eye {
  eyeball: EyeBallOrPupil;
  pupil: EyeBallOrPupil;
}

interface EyeBallOrPupil {
  x: number;
  y: number;
  radius: number;
}

@Component({
  selector: 'app-eye-movements-test',
  templateUrl: './eye-movements-test.component.html',
  styleUrls: ['./eye-movements-test.component.css']
})
export class EyeMovementsTestComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;
  eyes: Eye[] = [
    {
      eyeball: { x: 200, y: 200, radius: 50 },
      pupil: { x: 200, y: 200, radius: 20 },
    },
    {
      eyeball: { x: 400, y: 200, radius: 50 },
      pupil: { x: 400, y: 200, radius: 20 },
    },
  ];

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  draw(): void {
    this.eyes.forEach((eye) => {
      this.drawEye(eye);
      this.drawPupil(eye.pupil);
    });
  }

  drawEye(eye: Eye): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.arc(
      eye.eyeball.x,
      eye.eyeball.y,
      eye.eyeball.radius,
      0,
      Math.PI * 2
    );
    this.ctx.strokeStyle = "rgba(0, 0, 0, 1)"; // black colour
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawPupil(pupil: EyeBallOrPupil): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)"; // black colour
    this.ctx.fill(); // fill in pupil
    this.ctx.stroke();
    this.ctx.closePath();
  }

  mouseMoveHandler(e: MouseEvent): void {
    // get the X and Y coordinates of the mouse
    var mouseX = e.clientX - this.canvas.nativeElement.offsetLeft;
    var mouseY = e.clientY - this.canvas.nativeElement.offsetTop;

    // Get the center point between the eyes
    var centerX = (this.eyes[0].eyeball.x + this.eyes[1].eyeball.x) / 2;

    for (let i = 0; i < this.eyes.length; i++) {
      let eye = this.eyes[i];

      // Calculate the direction of the mouse from the center of the eyeball
      let dirX = mouseX - eye.eyeball.x;
      let dirY = mouseY - eye.eyeball.y;

      // Calculate the distance of the mouse from the center of the eyeball
      let distance = Math.sqrt(dirX * dirX + dirY * dirY);

      // Normalize the direction
      let dirNormX = dirX / distance;
      let dirNormY = dirY / distance;

      // Calculate the max distance the pupil can move inside the eyeball
      let maxPupilDistance = eye.eyeball.radius - eye.pupil.radius;

      // Calculate the effective distance the pupil should move (it can't move beyond the eyeball)
      let effectivePupilDistance = Math.min(distance, maxPupilDistance);

      // Check if the mouse X is within the boundaries (center of both eyes)
      if (mouseX > this.eyes[0].eyeball.x && mouseX < this.eyes[1].eyeball.x) {
        // If so, keep the pupil centered in the X direction
        eye.pupil.x = eye.eyeball.x;
      } else {
        // Otherwise, allow the pupil to move
        eye.pupil.x = eye.eyeball.x + dirNormX * effectivePupilDistance;
      }

      // Move the pupil in Y direction
      eye.pupil.y = eye.eyeball.y + dirNormY * effectivePupilDistance;
    }

    // Clear the previous drawing
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    // Draw the eyes and pupils
    this.draw();
  }

}
