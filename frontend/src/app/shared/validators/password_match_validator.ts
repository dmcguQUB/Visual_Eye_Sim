//validator to check if passwords are the same

import { AbstractControl } from "@angular/forms"

//function to get the form with both passwords entered when registering
export const PasswordsMatchValidator = (passwordControlName: string,
    confirmPasswordControlName: string) => {
      //create the form
      const validator = (form: AbstractControl) => {
        //find the passwords in form
        const passwordControl =  form.get(passwordControlName);
        const confirmPasswordControl =  form.get(confirmPasswordControlName);

        //compare their values to see if they are undefined
        if(!passwordControl || !confirmPasswordControl) return;

        //check if passwords are different. Confirm not match
        if(passwordControl.value !== confirmPasswordControl.value){
          confirmPasswordControl.setErrors({notMatch: true});
        }else{
          //check if there is an error with passwords 
          const errors = confirmPasswordControl.errors;
          if(!errors) return;

          //if they are both the same then delete they aren't a match
          delete errors['notMatch'];
          confirmPasswordControl.setErrors(errors);
        }
      }
      //return the whole function of validator
      return validator;
    }
