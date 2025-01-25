import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'swip-register-step-employee-4',
  imports: [TranslateModule],
  templateUrl: './register-step-employee-4.component.html',
})
export class RegisterStepEmployee4Component {
  @Input({ required: true }) form = {} as FormGroup;

  get name() {
    return this.form.get('firstName')?.value;
  }

  get lastName() {
    return this.form.get('lastName')?.value;
  }

  get city() {
    return this.form.get('city')?.value;
  }

  get telephone() {
    const tel = this.form.get('tel')?.value;
    const countryCode = this.form.get('countryCode')?.value;

    return `${countryCode} ${tel.replace(/(\d{3})(?=\d)/g, '$1-')}`;
  }

  get email() {
    return this.form.get('email')?.value;
  }

  get cv() {
    return this.form.get('cv')?.value.name;
  }
}
