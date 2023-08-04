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
  backgroundImg = new Image();

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
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.eyes.forEach((eye) => {
        this.drawEye(eye);
        this.drawPupil(eye.pupil);
      });
    }
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
    // existing code here ...

    // Clear the previous drawing
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    // Draw the eyes and pupils
    this.draw();
  }
}
