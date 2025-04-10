import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { EmailPasswordComponent } from '../../../core/components/email-password/email-password.component';
import { ConfirmPasswordErrorStateMatcher } from '../../../core/utils/confirm-password-error-state-matcher';

@Component({
  selector: 'swip-register-step-1',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
    EmailPasswordComponent,
  ],
  templateUrl: './register-step-1.component.html',
})
export class RegisterStep1Component {
  @Input({ required: true }) form = {} as FormGroup;
  matcher = new ConfirmPasswordErrorStateMatcher();

  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}
