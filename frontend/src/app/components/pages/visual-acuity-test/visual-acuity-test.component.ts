import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import { ButtonStateService } from 'src/app/services/buttonState.service';
import { CaseStudies } from 'src/app/shared/models/casestudies';

@Component({
  selector: 'app-visual-acuity-test',
  templateUrl: './visual-acuity-test.component.html',
  styleUrls: ['./visual-acuity-test.component.css'],
})
export class VisualAcuityTestComponent implements OnInit, AfterViewInit {
  @Input() caseStudy!: CaseStudies;
  @ViewChild('snellenChart') chart!: ElementRef;
  baseWidth!: number;
  zoomLevel: number = 1;
  answers: string[] = [];
  currentConvo = 1;// to order convo type
  displayedMessages: string[] = [];// declare messages var to show with time delay

  showStartButton: boolean = true;
  showNavButtons: boolean = false;

  constructor(private buttonStateService: ButtonStateService) {}


  ngOnInit(): void {
     // Subscribe to button state
     this.buttonStateService.currentButtonState.subscribe(state => this.showNavButtons = state);
  }

  ngAfterViewInit(): void {
    this.baseWidth = this.chart.nativeElement.clientWidth;
  }

  zoom(factor: number): void {
    this.zoomLevel *= factor;
    const newWidth = this.baseWidth * this.zoomLevel;
    this.chart.nativeElement.style.width = `${newWidth}px`;
  }

  //navigate between conversations
  nextConvo() {
    if (this.currentConvo < 3) {
      this.currentConvo++;
      this.showStartButton = true; // Reset the button for the next convo
      this.showNavButtons = false; // Hide the navigation buttons
    }
  }
  
  prevConvo() {
    if (this.currentConvo > 1) {
      this.currentConvo--;
      this.showStartButton = true; // Reset the button for the previous convo
      this.showNavButtons = false; // Hide the navigation buttons
    }
  }

  //function to delay the messages being shown by 1 second
  displayMessagesWithDelay(messages: any[]) {
    let index = 0;
  
    let intervalId = setInterval(() => {
      if (index < messages.length) {
        this.displayedMessages.push(messages[index]);
        index++;
      } else {
        clearInterval(intervalId);
        this.buttonStateService.changeButtonState(true); // Display the navigation buttons
      }
    }, 1000); // delay of 1 second
  }

  onDisplayMessages(index: number) {
    this.displayedMessages = []; // reset displayed messages
    this.showStartButton = false; // hide the start button
    this.displayMessagesWithDelay(this.allMessages[index]); // display messages from the selected array
  }

  
  clearConvo() {
    this.displayedMessages = [];
  }
  
  
  
  

  //messages to simulate convo between patient and user (start convo)
  messages1: any[] = [
    {
      role: 'user',
      text: 'I would like to perform a visual acuity test, where you read an eye chart. Have you done this before?',
    },
    { role: 'patient', text: 'Yes I have' },
    {
      role: 'user',
      text: 'Do you wear glasses, either for reading or day to day use?',
    },
    {
      role: 'patient',
      text: 'I normally wear bifocals but I have forgotten them today.',
    },
    { role: 'user', text: 'That is no problem, we can do the test now.' },
  ];
  //questions to ask the user
  qas1: { question: string; answers: string[] }[] = [
    {
      question: 'Do you need to use a pinhole for this test?',
      answers: ['Yes.', 'No.'],
    },
  ];

  //messages to simulate convo between patient and user (start convo)
  messages2: any[] = [
    {
      role: 'user',
      text: 'Please cover your left eye and read the letters the chart, starting from the top.',
    },
    { role: 'patient', text: "E... I can't make anymore out" },
  ];

  //questions to ask the user
  qas2: { question: string; answers: string[] }[] = [
    {
      question: 'What would you give the eye test grading?',
      answers: ['6/60', '6/36', '6/24', '6/18', '6/12', '6/9', '6/6', '6/5'],
    },
  ];

  //messages to simulate convo between patient and user (start convo). This will show 6/9 vision
  messages3: any[] = [
    {
      role: 'user',
      text: 'Thanks, now please can you do the same with the other eye starting from the top',
    },
    { role: 'patient', text: 'E...' },
    { role: 'patient', text: 'F...' },
    { role: 'patient', text: 'P...' },
    { role: 'patient', text: 'T...' },
    { role: 'patient', text: 'O...' },
    { role: 'patient', text: 'Z...' },
    { role: 'patient', text: 'L...' },
    { role: 'patient', text: 'P...' },
    { role: 'patient', text: 'E...' },
    { role: 'patient', text: 'D...' },
    { role: 'patient', text: 'P...' },
    { role: 'patient', text: 'E...' },
    { role: 'patient', text: 'C...' },
    { role: 'patient', text: 'F...' },
    { role: 'patient', text: "I can't see anymore" },
  ];

  //questions to ask the user
  qas3: { question: string; answers: string[] }[] = [
    {
      question: 'What would you give the eye test grading?',
      answers: ['6/60', '6/36', '6/24', '6/18', '6/12', '6/9', '6/6', '6/5'],
    },
  ];

  //create an array of all the messages 
  allMessages = [this.messages1, this.messages2, this.messages3];
}