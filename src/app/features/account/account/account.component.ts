import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageButtonsComponent } from '../../../core/components/language-buttons/language-buttons.component';
import { ResetPasswordComponent } from '../../../core/components/reset-password/reset-password.component';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { EUserType, ICV, IUser } from '../../../core/services/auth/auth.interface';
import { UserService } from '../../../core/services/user/user.service';
import { UploadFileComponent } from '../../../shared/components/upload-file/upload-file.component';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { ACCOUNT_DATA } from './account.data';

@Component({
  selector: 'swip-account',
  imports: [
    TopbarComponent,
    CommonModule,
    MatButtonModule,
    MatIcon,
    LanguageButtonsComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    UploadFileComponent,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './account.component.html',
})
export class AccountComponent {
  private destroyerRef = inject(DestroyRef);
  private userSubject = new BehaviorSubject<IUser | null>(null);
  readonly dialog = inject(MatDialog);

  editForm!: FormGroup;
  editMode = signal(false);
  ACCOUNT_DATA = ACCOUNT_DATA;
  user$ = this.userSubject.asObservable();
  EUserType = EUserType;
  dialogWidth = '50%';

  constructor(
    private auth: Auth,
    private userService: UserService,
    private fb: FormBuilder,
    private mobileService: MobileService
  ) {
    this.getUserData();
    this.setUpMobileSub();
  }

  private initEditForm(userData: IUser | null) {
    if (userData === null) return;
    this.editForm = this.fb.group({
      email: [userData.email, [Validators.required, Validators.email]],
      telephone: [
        userData.telephone,
        [Validators.required, Validators.pattern(/^\d{9}$|^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$|^\d{4}[-.\s]?\d{6}$/)],
      ],
      firstName: [userData.firstName, [Validators.required]],
      lastName: [userData.lastName, [Validators.required]],
      city: [userData.city],
      cv: [userData.cv, [Validators.required]],
    });
  }

  private setUpMobileSub() {
    this.mobileService.isMobile$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((isMobile) => (isMobile ? (this.dialogWidth = '90%') : (this.dialogWidth = '50%')));
  }

  private getUserData() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        if (user !== null) {
          this.userService.getUserData(user.uid).subscribe((userData) => {
            this.userSubject.next(userData);
            this.initEditForm(userData);
          });
        } else {
          this.userSubject.next(null);
        }
      });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.dialog.open(ResetPasswordComponent, {
      width: this.dialogWidth,
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  saveChanges() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        if (user !== null) {
          this.userService.saveUserData(user.uid, this.editForm.value as IUser);
          this.toggleMode();
        }
      });
  }

  toggleMode() {
    this.editMode.set(!this.editMode());
  }

  get cv() {
    if (user === null) return;
    return (this.editForm.get('cv')?.value as ICV).name;
  }
}
