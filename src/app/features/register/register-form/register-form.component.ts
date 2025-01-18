import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BulletsComponent } from '../../../shared/components/bullets/bullets.component';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';
import { RegisterStep1Component } from '../register-step-1/register-step-1.component';

@Component({
  selector: 'swip-register-form',
  imports: [
    ToggleComponent,
    BulletsComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterStep1Component,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  title = signal('Register');
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator } as FormControlOptions
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
