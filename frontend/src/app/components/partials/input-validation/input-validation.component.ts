import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

//show which error should be shown 
const VALIDATORS_MESSAGES:any = {
  required:'Should not be empty',
  email:'Email is not valid',
  minlength: 'Field is too short',
  notMatch: 'Password and Confirm does not match'
}

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.css']
})

//Onchanges added 
export class InputValidationComponent implements OnInit,OnChanges {
  //Abstract control from angular forms which is used within validation
  @Input()
  control!:AbstractControl;

  @Input()
  //show errors boolean
  showErrorsWhen:boolean = true;
  //error string array
  errorMessages: string[] = [];
 
  constructor() { }

  //call the validation
  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

  //need to call validation method for control. When status changes then subscribe to it
  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });
    //when value changes (e.g. add input) sibscribe to the changes
    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    })
  }

  //need to create validation method to populate errors array
  checkValidation(){
    const errors = this.control.errors;
    if(!errors){
      this.errorMessages = [];
      return;
    }

    const errorKeys = Object.keys(errors);
    //returns key of errors if they are present and return the message using the key
    this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);

  }

}
