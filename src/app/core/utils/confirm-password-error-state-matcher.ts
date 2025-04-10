import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const controlInvalid = !!(control && control.invalid && (control.dirty || control.touched));

    const parentInvalid = !!(
      form &&
      form.control &&
      form.control.errors &&
      form.control.errors['passwordMismatch'] &&
      (control?.dirty || control?.touched)
    );
    return controlInvalid || parentInvalid;
  }
}
