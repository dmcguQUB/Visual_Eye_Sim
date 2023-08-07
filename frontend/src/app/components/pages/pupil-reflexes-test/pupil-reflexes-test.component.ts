import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-pupil-reflexes-test',
  templateUrl: './pupil-reflexes-test.component.html',
  styleUrls: ['./pupil-reflexes-test.component.css']
})
export class PupilReflexesTestComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private mouseX = 0;
  private mouseY = 0;
  private faceImage = new Image();

  private eyes = [
    {
      iris: { x: 190, y: 97, radius: 15 }, // iris with smaller radius
      pupil: { x: 190, y: 97, radius: 10, targetRadius: 5 },
    },
    {
      iris: { x: 410, y: 97, radius: 15 }, // iris with smaller radius
      pupil: { x: 410, y: 97, radius: 10, targetRadius: 5 },
    },
  ];

  ngOnInit(): void {
    this.faceImage.onload = () => {
      this.drawScene();
    };
    //image for pupil reflexes
    this.faceImage.src = 'assets/woman-close-up-pr.jpg';
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
    this.drawScene();
  }

  ngOnDestroy(): void {
    this.canvas.nativeElement.removeEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }

  private mouseMoveHandler(e: MouseEvent): void {
    this.mouseX = e.clientX - this.canvas.nativeElement.offsetLeft;
    this.mouseY = e.clientY - this.canvas.nativeElement.offsetTop;
    this.setPupilTargetRadius();
    this.drawScene();
  }

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
  
  

  private drawScene(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.drawImage(this.faceImage, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
    for (let eye of this.eyes) {
      if (eye.pupil.radius < eye.pupil.targetRadius) {
        eye.pupil.radius += 0.2;
      } else if (eye.pupil.radius > eye.pupil.targetRadius) {
        eye.pupil.radius -= 0.2;
      }
  
      this.drawIris(eye.iris); // Call the drawIris method
      this.drawPupil(eye.pupil);
    }
  
    this.drawLightSource(); // Call the drawLightSource method
  }
  

  private drawLightSource(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.mouseX, this.mouseY, 15, 0, Math.PI * 2);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    this.ctx.closePath();
  }
  

  private drawIris(iris: any): void {
    this.ctx.beginPath();
    this.ctx.arc(iris.x, iris.y, iris.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(133, 245, 155, 0.6)"; // Changing the color to green
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawPupil(pupil: any): void {
    this.ctx.beginPath();
    this.ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
