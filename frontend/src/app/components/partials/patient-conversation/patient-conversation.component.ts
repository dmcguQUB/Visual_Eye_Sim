import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ButtonStateService } from 'src/app/services/buttonState.service';

@Component({
  selector: 'app-patient-conversation',
  templateUrl: './patient-conversation.component.html',
  styleUrls: ['./patient-conversation.component.css']
})
export class PatientConversationComponent {


  showStartButton: boolean = true;
  showNavButtons: boolean = false;

  constructor(private buttonStateService: ButtonStateService) {}


  ngOnInit(): void {
     // Subscribe to button state
     this.buttonStateService.currentButtonState.subscribe(state => this.showNavButtons = state);
  }

  @Input() messages: string[] = [];
  @Output() displayMessages = new EventEmitter<void>();
  
  displayedMessages: string[] = [];

  onDisplayMessages() {
    this.displayedMessages = [...this.messages];
    this.displayMessages.emit();
  }
}
