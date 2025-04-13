import { Component, DestroyRef, inject, NgZone, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { User, UserCredential } from 'firebase/auth';
import 'firebase/compat/storage';
import { catchError, from, of, switchMap, take, tap, throwError } from 'rxjs';
import { EUserType, ICompany, IUser } from '../../../core/services/auth/auth.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BulletsComponent } from '../../../shared/components/bullets/bullets.component';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';
import { BulletsService } from '../../../shared/services/bullets/bullets.service';
import { IToggleElement } from '../../../shared/services/toggle/toggle.interface';
import { ToggleService } from '../../../shared/services/toggle/toggle.service';
import { UserService } from '../../../shared/services/user/user.service';
import { RegisterStep1Component } from '../register-step-1/register-step-1.component';
import { RegisterStep2Component } from '../register-step-2/register-step-2.component';
import { RegisterStep4Component } from '../register-step-4/register-step-4.component';
import { RegisterStepEmployee3Component } from '../register-step-employee-3/register-step-employee-3.component';
import { RegisterStepEmployer3Component } from '../register-step-employer-3/register-step-employer-3.component';
import { RegisterService } from '../register.service';
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
    RegisterStep2Component,
    RegisterStepEmployee3Component,
    RegisterStep4Component,
    RegisterStepEmployer3Component,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private destroyerRef = inject(DestroyRef);
  employeeForm!: FormGroup;
  employerForm!: FormGroup;
  employeeTitlesCode = signal(['REGISTER', 'CONTACT_DATA', 'PERSONAL_DATA']);
  employerTitlesCode = signal(['REGISTER', 'CONTACT_DATA', 'COMPANY_DATA']);
  steps: IStep[] = [];
  currentStep = signal(0);
  currentTabId = signal(0);
  errorMessage = signal('');
  toggleValues: IToggleElement[] = [
    { isActive: true, translateCode: 'EMPLOYEE', id: 0 },
    { isActive: false, translateCode: 'EMPLOYER', id: 1 },
  ];

  constructor(
    private fb: FormBuilder,
    private bulletsService: BulletsService,
    private authService: AuthService,
    private userService: UserService,
    private toggleService: ToggleService,
    private registerService: RegisterService,
    private auth: Auth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.checkEmailVerificationOnInit();
    this.initEmployeeForm();
    this.initEmployerForm();
    this.setUpFormSub();
    this.setUpBulletSub();
    this.setUpToggleSub();
    this.initializeBullets();
  }

  private checkEmailVerificationOnInit() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef), take(1))
      .subscribe((user) => this.redirectToNotVerified(user));
  }

  private redirectToNotVerified(user: User | null): void {
    if (user) {
      from(user.reload())
        .pipe(
          switchMap(() => {
            if (!user.emailVerified) {
              return this.ngZone.run(() => {
                this.router.navigate(['/not-verified']);
                return of(null);
              });
            }
            return of(null);
          })
        )
        .subscribe();
    }
  }

  private initEmployeeForm() {
    this.employeeForm = this.fb.group(
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

  private initEmployerForm() {
    this.employerForm = this.fb.group(
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
        companyName: ['', [Validators.required]],
        companyImage: [''],
        city: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator } as FormControlOptions
    );
  }

  private setUpToggleSub() {
    this.toggleService.toggle$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((toggle) => {
      this.reset();
      this.currentTabId.set(toggle.find((t) => t.isActive)?.id || 0);
    });
  }

  private reset() {
    this.employeeForm.reset({
      email: '',
      password: '',
      confirmPassword: '',
      contactEmail: '',
      countryCode: '+48',
      tel: '',
      firstName: '',
      lastName: '',
      city: '',
      cv: null,
    });

    this.employerForm.reset({
      email: '',
      password: '',
      confirmPassword: '',
      contactEmail: '',
      countryCode: '+48',
      tel: '',
      companyName: '',
      city: '',
      companyImage: null,
    });
    this.currentStep.set(0);
    this.initializeBullets();
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

  private setUpBulletSub() {
    this.bulletsService.bullets$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((bullets) => {
      this.steps = bullets;
      this.currentStep.set(bullets.find((b) => b.isActive)?.id || 0);
    });
  }

  private setUpFormSub() {
    this.employeeForm.valueChanges.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe(() => {
      this.updateStepStatus();
    });
  }

  private updateStepStatus() {
    this.bulletsService.updateStepStatus(
      this.steps.map((step, index) => ({
        ...step,
        isActive: index === this.currentStep(),
        valid: this.getStepValidity(index),
      }))
    );
  }

  private getStepValidity(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0:
        return this.isStep1Valid || false;
      case 1:
        return this.isStep2Valid || false;
      case 2:
        return this.isStep3Valid || false;
      case 3:
        return this.isStep4Valid || false;
      default:
        return false;
    }
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  prevStep() {
    const prev = this.currentStep() - 1;
    if (prev >= 0) {
      this.currentStep.set(prev);
      this.updateStepStatus();
    }
  }

  nextStep() {
    if (this.isNextDisabled) return;
    const next = this.currentStep() + 1;
    if (next < this.steps.length) {
      this.currentStep.set(next);
      this.updateStepStatus();
    }
  }

  private getEmployeeData(email: string) {
    return {
      email,
      firstName: this.employeeForm.get('firstName')?.value,
      lastName: this.employeeForm.get('lastName')?.value,
      telephone: `${this.employeeForm.get('countryCode')?.value}${this.employeeForm.get('tel')?.value}`,
      city: this.employeeForm.get('city')?.value,
      cv: null,
      userType: EUserType.EMPLOYEE,
    } as IUser;
  }

  private getEmployerData(email: string) {
    return {
      email,
      companyName: this.employerForm.get('companyName')?.value,
      telephone: `${this.employerForm.get('countryCode')?.value}${this.employerForm.get('tel')?.value}`,
      city: this.employerForm.get('city')?.value,
      companyImage: this.employerForm.get('companyImage')?.value,
      userType: EUserType.EMPLOYER,
    } as ICompany;
  }

  register(): void {
    const email = this.determineActiveForm.get('email')?.value;
    const password = this.determineActiveForm.get('password')?.value;
    const cv = this.employeeForm.get('cv')?.value;
    const companyImage = this.employerForm.get('companyImage')?.value;

    this.authService
      .register(email, password)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(this.getErrorMessage(error.code));
          return throwError(() => error);
        }),
        switchMap((userCredential: UserCredential) => {
          let userData = {} as IUser | ICompany;

          if (this.currentTabId() === 0) {
            // Employee
            userData = this.getEmployeeData(email);
          } else {
            // Employer
            userData = this.getEmployerData(email);
          }

          return this.userService.saveUserData(userCredential.user.uid, userData).pipe(
            switchMap(() => this.authService.sendVerificationEmail()),
            tap(() => {
              this.registerService.updateStatus(true);
            }),
            switchMap(() => {
              const key = cv ? 'cv' : 'companyImage';
              const updatedUserData = { ...userData, [key]: cv ? cv : companyImage };
              localStorage.setItem('pendingUserData', JSON.stringify(updatedUserData));
              return of(null);
            }),
            switchMap(() => {
              this.redirectToNotVerified(this.auth.currentUser);
              return of(null);
            }),
            catchError((error) => {
              this.errorMessage.set(this.getErrorMessage(error.code));
              throw error;
            })
          );
        })
      )
      .subscribe();
  }

  private getErrorMessage(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'INVALID_EMAIL';
      case 'auth/email-already-in-use':
        return 'EMAIL_ALREADY_IN_USE';
      case 'auth/weak-password':
        return 'WEAK_PASSWORD';
      default:
        return 'DEFAULT_ERROR';
    }
  }

  get determineActiveForm() {
    return this.currentTabId() === 0 ? this.employeeForm : this.employerForm;
  }

  get isStep1Valid(): boolean | undefined {
    const password = this.determineActiveForm.get('password')?.value;
    const confirmPassword = this.determineActiveForm.get('confirmPassword')?.value;
    const passwordsMatch = password === confirmPassword;

    return (
      this.determineActiveForm.get('email')?.valid &&
      this.determineActiveForm.get('password')?.valid &&
      this.determineActiveForm.get('confirmPassword')?.valid &&
      passwordsMatch
    );
  }

  get isStep2Valid(): boolean | undefined {
    return (
      this.determineActiveForm.get('contactEmail')?.valid &&
      this.determineActiveForm.get('tel')?.valid &&
      this.determineActiveForm.get('countryCode')?.valid
    );
  }

  get isStep3Valid(): boolean | undefined {
    if (this.currentTabId() === 0 && this.determineActiveForm.get('cv')) {
      // Employee form
      return (
        this.employeeForm.get('firstName')?.valid &&
        this.employeeForm.get('lastName')?.valid &&
        this.employeeForm.get('city')?.valid &&
        this.employeeForm.get('cv')?.valid
      );
    } else {
      return (
        this.employerForm.get('companyName')?.valid &&
        this.employerForm.get('city')?.valid &&
        this.employerForm.get('companyImage')?.valid
      );
    }
  }

  get isStep4Valid(): boolean | undefined {
    return this.determineActiveForm.valid;
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
