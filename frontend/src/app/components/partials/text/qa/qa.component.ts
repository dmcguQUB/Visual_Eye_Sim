import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QaComponent {

  @Input() questionsAndAnswers: { question: string; answers: string[] }[] = [];
  @Input() answers: string[] = [];
  @Output() submit = new EventEmitter<void>();
  @Output() answersChange = new EventEmitter<any>();

  onSubmit() {
    this.submit.emit();
  }

  

}
