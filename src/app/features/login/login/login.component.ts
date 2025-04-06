import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { catchError, from, switchMap } from 'rxjs';
import { EmailPasswordComponent } from '../../../core/components/email-password/email-password.component';
import { FrameComponent } from '../../../core/components/frame/frame.component';

@Component({
  selector: 'swip-login',
  imports: [
    EmailPasswordComponent,
    TranslateModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FrameComponent,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form!: FormGroup;
  forgotPasswordForm!: FormGroup;
  forgotPassword = signal(false);
  resetEmailSend = signal(false);
  errorCode = signal('');
  private destroyerRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.initForms();
  }

  initForms() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  login() {
    const { email, password } = this.form.value;

    from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        switchMap(() => user(this.auth)),
        takeUntilDestroyed(this.destroyerRef),
        catchError((error) => {
          this.errorCode.set(this.getErrorMessage(error.code));
          console.log(error);
          throw error;
        })
      )
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }

  remindPasswordViewToggle() {
    this.errorCode.set('');
    this.forgotPassword.set(!this.forgotPassword());
  }

  resetPassword() {
    const email = this.forgotPasswordForm.get('email')?.value;

    from(sendPasswordResetEmail(this.auth, email))
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        catchError((error) => {
          this.errorCode.set(this.getErrorMessage(error.code));
          throw error;
        })
      )
      .subscribe(() => this.resetEmailSend.set(true));
  }

  private getErrorMessage(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'INVALID_EMAIL';
      case 'auth/invalid-credential':
        return 'INVALID_CREDENTIALS';
      case 'auth/user-not-found':
        return 'USER_NOT_FOUND';
      case 'auth/wrong-password':
        return 'INALID_PASSWORD';
      default:
        return 'DEFAULT_ERROR';
    }
  }
}
