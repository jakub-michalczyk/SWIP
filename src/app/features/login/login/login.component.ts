import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { EmailPasswordComponent } from '../../../core/components/email-password/email-password.component';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';

@Component({
  selector: 'swip-login',
  imports: [
    EmailPasswordComponent,
    TopbarComponent,
    TranslateModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form!: FormGroup;
  forgotPasswordForm!: FormGroup;
  forgotPassword = signal(false);
  resetEmailSend = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: Auth
  ) {
    this.initForms();
  }

  initForms() {
    this.form = this.fb.group({
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
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  login() {
    signInWithEmailAndPassword(this.auth, this.form.get('email')?.value, this.form.get('password')?.value)
      .then((userCredential) => {
        console.log('Zalogowano:', userCredential.user);
      })
      .catch((error) => {
        console.error('Błąd logowania:', error);
      });
  }

  remindPassword() {
    this.forgotPassword.set(!this.forgotPassword());
  }

  resetPassword() {
    sendPasswordResetEmail(this.auth, this.forgotPasswordForm.get('email')?.value)
      .then(() => {
        this.resetEmailSend.set(true);
      })
      .catch((error) => {
        console.error('An error occurred while sending the email:', error);
      });
  }
}
