//this component is to simplify the login page with input container and input validation added to one module

import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
//inputs
  @Input()
control!:AbstractControl;
@Input()
showErrorsWhen:boolean = true;
@Input()
label!: string;
//type can be text,password or email. Default should be text
@Input()
type: 'text' | 'password' | 'email' = 'text';

//require form control 
get formControl(){
  return this.control as FormControl;
}
  constructor() { }

  ngOnInit(): void {
  }

}
