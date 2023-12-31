import {
  ViewChild,
  ElementRef,
  Component,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UseCaseService } from 'src/app/services/usecases.service';
import { Subscription } from 'rxjs';  // <-- Import Subscription
import { CaseStudies } from 'src/app/shared/models/casestudies';
import { Iris } from 'src/app/shared/interfaces/IDrawings.ts/IEye';


//removed the styles and doesn't have a template as code is mainly just ts file
@Component({
  selector: 'app-visual-fields',
  template: '',
})

//creating abstract class as will be used by both left and right eye
export abstract class VisualFieldsComponent implements OnDestroy {

  //properties - shared
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  protected ctx!: CanvasRenderingContext2D;

  protected face = { x: 0, y: 0, radiusX: 0, radiusY: 0, rotation: 0 };
  protected iriss: Iris[] = []; // <-- Defined type instead of any


  caseStudy = new CaseStudies();
    // Add new property for the message
    buttonMessage: string = '';
    backgroundImg = new Image();
    imageLoaded: boolean= false;
    handImage = new Image();
  //image to determine which iris it is
  thisEye: string = 'Left';
  otherEye: string = 'Right';

  private subscriptions: Subscription = new Subscription(); // <-- Store subscriptions
  
  // define separate flags for each image
  backgroundImgLoaded: boolean = false;
  handImageLoaded: boolean = false;

  //constructor
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private useCaseService: UseCaseService // Inject UseCaseService
  ) {}

   // Abstract method for setting the hand image source
   abstract setHandImageSrc(): string;

   // Abstract method for setting the button messages
   abstract setButtonMessages(): { [id: string]: string };
 

  ngOnInit(): void {

    //load face
    this.backgroundImg.onload = () => {
      this.backgroundImgLoaded = true;
    };
    this.backgroundImg.src = 'assets/woman close up.png';

   //load the picture of hand
   this.handImage.onload = () => {
    this.handImageLoaded = true;
  };
  this.handImage.src = this.setHandImageSrc();


   
  const subscription = this.activatedRoute.params.subscribe((params) => {
    if (params['useCaseId']) {
      this.useCaseService.getUseCaseById(params['useCaseId']).subscribe(
        (serverCaseStudy) => {
          this.caseStudy = serverCaseStudy;
        },
        (error) => {
          console.log('An error occurred:', error);
        }
      );
    }
  });

  //add subscription
  this.subscriptions.add(subscription);


    //set button messages from cource
    this.buttonMessages = this.setButtonMessages();
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context !== null) {
      this.ctx = context;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      this.face = {
        x: canvas.width / 2,
        y: 400,
        radiusX: 300,
        radiusY: 300,
        rotation: 0,
      };

      this.iriss = [
        {
          iris: { x: canvas.width / 2 - 110, y: 280, radius: 13 },
          pupil: {
            x: canvas.width / 2 - 110,
            y: 280,
            radius: 7,
            targetRadius: 20,
          },
        },
        {
          iris: { x: canvas.width / 2 + 110, y: 280, radius: 13 },
          pupil: {
            x: canvas.width / 2 + 110,
            y: 280,
            radius: 7,
            targetRadius: 20,
          },
        },
      ];

   

      window.requestAnimationFrame(this.animation.bind(this));
    } else {
      console.error('2D context not available');
    }
  }


  animation() {
    // check both flags
    if (this.backgroundImgLoaded && this.handImageLoaded) {
      this.ctx.clearRect(
        0,
        0,
        this.myCanvas.nativeElement.width,
        this.myCanvas.nativeElement.height
      );
      this.drawFace();
      this.iriss.forEach(iris => {
        this.drawIris(iris.iris);
        this.drawPupil(iris.pupil);
      });
      this.drawHand();
    } else {
      window.requestAnimationFrame(this.animation.bind(this));
    }
  }

  
  
  drawHand() {
    this.ctx.drawImage(this.handImage, 0, 0); //<----need to change this for each
  }



  drawFace() {
    // Draw the image at the same coordinates as the face
    this.ctx.drawImage(this.backgroundImg, this.face.x - this.face.radiusX, this.face.y - this.face.radiusY, this.face.radiusX * 2, this.face.radiusY * 2);
  }

  drawIris(iris: any) {
    this.ctx.beginPath();
    this.ctx.arc(iris.x, iris.y, iris.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'green'; // black color

    this.ctx.strokeStyle = 'green'; // black color
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

  //determine the iris it is so can change the text in button dynamically
  // Update your handleClick() method
  handleClick(): void {
    this.thisEye = this.thisEye === 'Left' ? 'Right' : 'Left';
    let route = this.thisEye === 'Right' ? '/visual-fields-test-right/' : '/visual-fields-test-left/';
  
    this.activatedRoute.params.subscribe((params) => {
      if (params['useCaseId']) {
        this.router.navigate([`${route}${params['useCaseId']}`]);
      }
    });
  }
  

    //button and messages <-Need to change this for each hand
  // to this
 //button and messages <-Need to change this for each hand
  // to this
  buttonMessages: { [id: string]: string } = {};

  handleButtonClick(buttonId: string): void {
    if (this.buttonMessages[buttonId]) {
      this.buttonMessage = this.buttonMessages[buttonId];
    } else {
      // Optional: default message for unhandled button IDs
      this.buttonMessage = 'Unrecognized button clicked!';
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // <-- Unsubscribe

    if (typeof window.cleanup === "function") {
      window.cleanup();
    }
  }
}



