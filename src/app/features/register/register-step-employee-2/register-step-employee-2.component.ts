import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'swip-register-step-employee-2',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    MatIconModule,
    MatSelectModule,
    TranslateModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './register-step-employee-2.component.html',
})
export class RegisterStepEmployee2Component {
  @Input({ required: true }) form = {} as FormGroup;
  selectedCountryCode = '+48';
  phoneMask = '000-000-000';
  placeholder = '661-898-574';

  constructor() {}

  onCountryCodeChange(event: any) {
    const countryCode = event.value;

    switch (countryCode) {
      case '+48': // Poland
        this.phoneMask = '000-000-000';
        this.placeholder = ' 661-898-574';
        break;
      case '+1': // USA
        this.phoneMask = '000-000-0000';
        this.placeholder = ' 661-898-5741';
        break;
      case '+44': // UK
        this.phoneMask = '00000-000000';
        this.placeholder = ' 66122-898574';
        break;
      default:
        this.phoneMask = '000-000-000';
        this.placeholder = ' 661-898-574';
        break;
    }
  }
}
