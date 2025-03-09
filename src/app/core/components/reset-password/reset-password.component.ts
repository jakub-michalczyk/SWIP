import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, sendPasswordResetEmail, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { from, switchMap, tap } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'swip-reset-password',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, TranslateModule],
  templateUrl: '../modal/modal.component.html',
})
export class ResetPasswordComponent extends ModalComponent {
  private destroyerRef = inject(DestroyRef);

  constructor(private auth: Auth) {
    super();
  }

  override accept() {
    user(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        switchMap((user) => from(sendPasswordResetEmail(this.auth, user?.email || ''))),
        tap(() => this.accepted.set(true))
      )
      .subscribe({
        next: () => console.log('Password reset email sent'),
        error: (error) => console.error('Reset password error:', error),
      });
  }
}
