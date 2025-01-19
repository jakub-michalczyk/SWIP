import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { BulletsService } from '../../../shared/services/bullets/bullets.service';
import { RegisterStep1Component } from '../register-step-1/register-step-1.component';
import { RegisterStepEmployee2Component } from '../register-step-employee-2/register-step-employee-2.component';
import { RegisterStepEmployee3Component } from '../register-step-employee-3/register-step-employee-3.component';

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
    RegisterStepEmployee2Component,
    RegisterStepEmployee3Component,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private destroyerRef = inject(DestroyRef);
  title = signal('Register');
  form: FormGroup;
  currentStep = signal(0);
  maxSteps = 4;
  employeeTitles = ['Register', 'Contact Data', 'Personal Data'];

  constructor(
    private fb: FormBuilder,
    private bulletsService: BulletsService
  ) {
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
        contactEmail: ['', [Validators.required, Validators.email]],
        countryCode: ['+48', [Validators.required, Validators.pattern(/^\+(48|1|44)$/)]],
        tel: [
          '',
          [Validators.required, Validators.pattern(/^\d{9}$|^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$|^\d{4}[-.\s]?\d{6}$/)],
        ],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        city: [''],
      },
      { validators: this.passwordMatchValidator } as FormControlOptions
    );
    this.setUpBulletsSub();
  }

  setUpBulletsSub() {
    this.bulletsService.activeBullet$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((activeId) => {
      this.currentStep.set(activeId);
      this.title.set(this.employeeTitles[activeId]);
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  prevStep() {
    this.bulletsService.setActiveBullet(this.currentStep() - 1);
  }

  nextStep() {
    this.bulletsService.setActiveBullet(this.currentStep() + 1);
  }

  get isStep1Valid(): boolean | undefined {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    const passwordsMatch = password === confirmPassword;

    return (
      this.form.get('email')?.valid &&
      this.form.get('password')?.valid &&
      this.form.get('confirmPassword')?.valid &&
      passwordsMatch
    );
  }

  get isStep2Valid(): boolean | undefined {
    return this.form.get('contactEmail')?.valid && this.form.get('tel')?.valid && this.form.get('countryCode')?.valid;
  }

  get isNextDisabled(): boolean {
    if (this.currentStep() === 0) {
      return !this.isStep1Valid;
    } else if (this.currentStep() === 1) {
      return !this.isStep2Valid;
    }
    return false;
  }
}
