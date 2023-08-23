import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.css']
})
export class DefaultButtonComponent implements OnInit {

  //type either submit or button, by default should be submit
  @Input()
  type: 'submit' | 'button' = 'submit';
  //text is string and Submit by default
  @Input()
  text:string = 'Submit';
  //background colour 
  @Input()
  bgColor = '#e72929';
  //colour white
  @Input()
  color = 'white';
 //fomt size 
  @Input()
  fontSizeRem = 1.3;
  //width
  @Input()
  widthRem = 12;
  //output should be on click should be passed to Event Emitter 
  @Output()
  onClick = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
