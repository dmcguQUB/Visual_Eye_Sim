//component to be used to show user converations
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-patient-convo',
  templateUrl: './patient-convo.component.html',
  styleUrls: ['./patient-convo.component.css']
})
export class PatientConvoComponent {

  @Input() messages: any[] = [];

  newMessage: string = '';

  sendMessage(event: any) {
    event.preventDefault();
    this.messages.push({ role: 'user', text: this.newMessage });
    this.newMessage = '';
    this.replyFromPatient();
  }

  replyFromPatient() {
    // Here you can add logic for generating patient's responses
    // For now, the patient just repeats the user's last message
    this.messages.push({ role: 'patient', text: `You just said: "${this.messages[this.messages.length - 1].text}"` });
  }
}