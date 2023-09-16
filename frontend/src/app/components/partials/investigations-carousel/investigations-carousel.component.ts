import { Component } from '@angular/core';

@Component({
  selector: 'app-investigations-carousel',
  templateUrl: './investigations-carousel.component.html',
  styleUrls: ['./investigations-carousel.component.css']
})
export class InvestigationsCarouselComponent {

  images: string[] = [
    "assets/investigations/CT.jpeg",
    "assets/investigations/Fundus-photograph-of-an-inferior-branch-retinal-vein-occlusion-in-the-left-eye-showing.png",
    "assets/investigations/Optical coherence tomography.jpeg"
  ];
  currentIndex: number = 0;

  changeImage(direction: number): void {
    this.currentIndex += direction;
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    } else if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    }
  }
}


