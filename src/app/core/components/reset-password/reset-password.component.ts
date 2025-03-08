import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, sendPasswordResetEmail, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { from, switchMap, tap } from 'rxjs';

@Component({
  selector: 'swip-reset-password',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  readonly dialogRef = inject(MatDialogRef<ResetPasswordComponent>);
  private destroyerRef = inject(DestroyRef);
  emailSent = signal(false);

  constructor(private auth: Auth) {}

  resetPassword() {
    user(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        switchMap((user) => from(sendPasswordResetEmail(this.auth, user?.email || ''))),
        tap(() => this.emailSent.set(true))
      )
      .subscribe({
        next: () => console.log('Password reset email sent'),
        error: (error) => console.error('Reset password error:', error),
      });
  }
}
