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
import { TranslateModule } from '@ngx-translate/core';
import { UserCredential } from 'firebase/auth';
import 'firebase/compat/storage';
import { EMPTY, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FileService } from '../../../core/services/file/file.service';
import { BulletsComponent } from '../../../shared/components/bullets/bullets.component';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';
import { BulletsService } from '../../../shared/services/bullets/bullets.service';
import { RegisterStep1Component } from '../register-step-1/register-step-1.component';
import { RegisterStepEmployee2Component } from '../register-step-employee-2/register-step-employee-2.component';
import { RegisterStepEmployee3Component } from '../register-step-employee-3/register-step-employee-3.component';
import { RegisterStepEmployee4Component } from '../register-step-employee-4/register-step-employee-4.component';
import { IStep } from './register-form.interface';

@Component({
  selector: 'swip-register-form',
  imports: [
    ToggleComponent,
    BulletsComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RegisterStep1Component,
    RegisterStepEmployee2Component,
    RegisterStepEmployee3Component,
    RegisterStepEmployee4Component,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private destroyerRef = inject(DestroyRef);
  form!: FormGroup;
  employeeTitlesCode = signal(['REGISTER', 'CONTACT_DATA', 'PERSONAL_DATA']);
  steps: IStep[] = [];
  currentStep = signal(0);
  submitted = signal(false);
  verified = signal(false);

  constructor(
    private fb: FormBuilder,
    private bulletsService: BulletsService,
    private authService: AuthService,
    private fileService: FileService
  ) {
    this.initForm();
    this.setUpFormSub();
    this.setUpBulletSub();
    this.initializeBullets();
  }

  private initForm() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])(?=(.*[A-Za-z]){4,})[A-Za-z\d@$!%*?&]{7,}$/
            ),
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
        cv: [null, [Validators.required]],
      },
      { validators: this.passwordMatchValidator } as FormControlOptions
    );
  }

  private initializeBullets() {
    this.steps = [
      { id: 0, isActive: true, valid: false },
      { id: 1, isActive: false, valid: false },
      { id: 2, isActive: false, valid: false },
      { id: 3, isActive: false, valid: false },
    ];

    this.bulletsService.updateStepStatus(this.steps);
  }

  setUpBulletSub() {
    this.bulletsService.bullets$.subscribe((bullets) => {
      this.steps = bullets;
      this.currentStep.set(bullets.find((b) => b.isActive)?.id || 0);
    });
  }

  setUpFormSub() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe(() => {
      const updatedSteps: IStep[] = [
        { id: 0, isActive: this.currentStep() === 0, valid: this.isStep1Valid || false },
        { id: 1, isActive: this.currentStep() === 1, valid: this.isStep2Valid || false },
        { id: 2, isActive: this.currentStep() === 2, valid: this.isStep3Valid || false },
        { id: 3, isActive: this.currentStep() === 3, valid: this.isStep4Valid || false },
      ];

      this.bulletsService.updateStepStatus(updatedSteps);
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  prevStep() {
    this.currentStep.set(this.currentStep() - 1);
    this.bulletsService.resetBullets(this.steps);
    this.steps[this.currentStep()].isActive = true;
    this.bulletsService.updateStepStatus(this.steps);
  }

  nextStep() {
    this.currentStep.set(this.currentStep() + 1);
    this.bulletsService.resetBullets(this.steps);
    this.steps[this.currentStep()].isActive = true;
    this.steps[this.currentStep() - 1].valid = true;
    this.bulletsService.updateStepStatus(this.steps);
  }

  register(): void {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const cv = this.form.get('cv')?.value;

    this.authService
      .register(email, password)
      .pipe(
        switchMap((userCredential: UserCredential) => {
          return this.authService.sendVerificationEmail().pipe(
            tap(() => this.submitted.set(true)),
            switchMap(() => {
              return this.authService.waitForEmailVerification(userCredential.user).pipe(
                switchMap(() => {
                  const cvBase64$ = cv ? this.fileService.convertFileToBase64(cv) : EMPTY;

                  this.verified.set(true);
                  return cvBase64$.pipe(
                    switchMap((cvBase64: string | null) => {
                      const userData = {
                        email,
                        firstName: this.form.get('firstName')?.value,
                        lastName: this.form.get('lastName')?.value,
                        telephone: `${this.form.get('countryCode')?.value}${this.form.get('tel')?.value}`,
                        city: this.form.get('city')?.value,
                        cvBase64,
                      };

                      return this.authService.saveUserData(userCredential.user.uid, userData);
                    })
                  );
                })
              );
            })
          );
        })
      )
      .subscribe({
        error: (error: Error) => {
          console.error('Error:', error);
        },
      });
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

  get isStep3Valid(): boolean | undefined {
    return (
      this.form.get('firstName')?.valid &&
      this.form.get('lastName')?.valid &&
      this.form.get('city')?.valid &&
      this.form.get('cv')?.valid
    );
  }

  get isStep4Valid(): boolean | undefined {
    return this.form.valid;
  }

  get isNextDisabled(): boolean {
    let valid = false;

    switch (this.currentStep()) {
      case 0:
        valid = !this.isStep1Valid;
        break;
      case 1:
        valid = !this.isStep2Valid;
        break;
      case 2:
        valid = !this.isStep3Valid;
        break;
      case 3:
        valid = !this.isStep4Valid;
        break;
      default:
        valid = true;
    }

    return valid;
  }
}
