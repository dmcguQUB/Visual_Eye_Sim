import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

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
  styleUrls: ['./eye-movements-test.component.css'],
})
export class EyeMovementsTestComponent implements OnInit, AfterViewInit {
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

  ngOnInit(): void {
    this.backgroundImg.src = 'assets/woman close up.png'; // adjust this path accordingly
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.backgroundImg.onload = () => {
      this.draw();
    };
  }

  draw(): void {
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
    this.ctx.fillStyle = 'green'; // green colour
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw the inner circle (pupil)
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius / 2, 0, Math.PI * 2); // Use pupil.radius / 2 to make the pupil half the size of the iris
    this.ctx.fillStyle = 'black'; // black colour
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  mouseMoveHandler(e: MouseEvent): void {
    // get the X and Y coordinates of the mouse
    var mouseX = e.clientX - this.canvas.nativeElement.offsetLeft;
    var mouseY = e.clientY - this.canvas.nativeElement.offsetTop;
  
    for (var i = 0; i < this.eyes.length; i++) {
      var eye = this.eyes[i];
  
      // Calculate the direction of the mouse from the center of the eyeball
      var dirX = mouseX - eye.eyeball.x;
      var dirY = mouseY - eye.eyeball.y;
  
      // Adjust the X direction for the oval shape
      dirX /= 1.5;
  
      // Calculate the distance of the mouse from the center of the eyeball
      var distance = Math.sqrt(dirX * dirX + dirY * dirY);
  
      // Normalize the direction
      var dirNormX = dirX / distance;
      var dirNormY = dirY / distance;
  
      // Calculate the max distance the pupil can move inside the eyeball
      var maxPupilDistance = eye.eyeball.radius - eye.pupil.radius;
  
      // Calculate the effective distance the pupil should move (it can't move beyond the eyeball)
      var effectivePupilDistance = Math.min(distance, maxPupilDistance);
  
      // Move the pupil
      eye.pupil.x = eye.eyeball.x + dirNormX * effectivePupilDistance * 1.5;  // Apply the scaling factor
      eye.pupil.y = eye.eyeball.y + dirNormY * effectivePupilDistance;
    }
  
    // Clear the previous drawing
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  
    // Draw the eyes, pupils and face 
    this.draw();
  }
  
}
