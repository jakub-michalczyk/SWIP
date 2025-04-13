import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { LanguageButtonsComponent } from '../../../core/components/language-buttons/language-buttons.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { ResetPasswordComponent } from '../../../core/components/reset-password/reset-password.component';
import { UploadImageComponent } from '../../../core/components/upload-image/upload-image.component';
import { EUserType, ICompany, IFile, IUser } from '../../../core/services/auth/auth.interface';
import { UploadFileComponent } from '../../../shared/components/upload-file/upload-file.component';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { UserService } from '../../../shared/services/user/user.service';
import { ACCOUNT_DATA } from './account.data';
import { IAccountDataKey } from './account.interface';

@Component({
  selector: 'swip-account',
  imports: [
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
    UploadImageComponent,
    MatCardModule,
    FrameComponent,
    LoaderComponent,
  ],
  templateUrl: './account.component.html',
})
export class AccountComponent {
  private destroyerRef = inject(DestroyRef);
  private userSubject = new BehaviorSubject<IUser | ICompany | null>(null);
  readonly dialog = inject(MatDialog);

  editForm!: FormGroup;
  editMode = signal(false);
  ACCOUNT_DATA = signal(ACCOUNT_DATA);
  userType = signal(EUserType.EMPLOYEE);
  loading = signal(true);
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

  private setUpUserData() {
    this.ACCOUNT_DATA.set({
      personalData: [
        { title: 'FIRST_NAME', value: 'firstName' } as IAccountDataKey,
        { title: 'LAST_NAME', value: 'lastName' } as IAccountDataKey,
        ...ACCOUNT_DATA.personalData,
      ],
      contactData: [...ACCOUNT_DATA.contactData],
    });
  }

  private setUpCompanyData() {
    this.ACCOUNT_DATA.set({
      ...ACCOUNT_DATA,
      personalData: [{ title: 'COMPANY_NAME', value: 'companyName' } as IAccountDataKey, ...ACCOUNT_DATA.personalData],
    });
  }

  private initSharedForm(userData: IUser | ICompany) {
    this.editForm = this.fb.group({
      email: [userData.email, [Validators.required, Validators.email]],
      telephone: [
        userData.telephone,
        [Validators.required, Validators.pattern(/^\d{9}$|^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$|^\d{4}[-.\s]?\d{6}$/)],
      ],
      city: [userData.city],
    });
  }

  private setUpUserForm(userData: IUser) {
    const newFields = {
      cv: new FormControl(userData.cv, [Validators.required]),
      firstName: new FormControl(userData.firstName, [Validators.required]),
      lastName: new FormControl(userData.lastName, [Validators.required]),
    };

    Object.keys(newFields).forEach((key) => {
      this.editForm.addControl(key, newFields[key as keyof typeof newFields]);
    });
  }

  private setUpCompanyForm(userData: ICompany) {
    const newFields = {
      companyImage: new FormControl(userData.companyImage),
      companyName: new FormControl(userData.companyName, [Validators.required]),
    };

    Object.keys(newFields).forEach((key) => {
      this.editForm.addControl(key, newFields[key as keyof typeof newFields]);
    });
  }

  private setUpMobileSub() {
    this.mobileService.isMobile$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((isMobile) => (isMobile ? (this.dialogWidth = '90%') : (this.dialogWidth = '50%')));
  }

  private getUserData() {
    this.loading.set(true);
    this.userService.getUserData().subscribe((userData) => {
      if (userData !== null) {
        this.userSubject.next(userData);
        this.initForm(userData);
        this.userType.set(userData.userType);
      } else {
        this.userSubject.next(null);
      }
      this.loading.set(false);
    });
  }

  private initForm(userData: IUser | ICompany) {
    this.initSharedForm(userData);
    if (userData.userType === EUserType.EMPLOYEE) {
      this.setUpUserData();
      this.setUpUserForm(userData as IUser);
    } else {
      this.setUpCompanyData();
      this.setUpCompanyForm(userData as ICompany);
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.dialog.open(ResetPasswordComponent, {
      width: this.dialogWidth,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titleCode: 'RESET_PASSWORD',
        messageCode: 'RESET_PASSWORD_MESSAGE',
        afterAcceptMessageCode: 'RESET_FINISHED',
      },
    });
  }

  saveChanges() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        if (user !== null) {
          this.userService.saveUserData(user.uid, {
            ...(this.editForm.value as IUser),
            userType: this.userType(),
          });
          this.toggleMode(true);
        }
      });
  }

  toggleMode(saved?: boolean) {
    if (this.editMode() && !saved) {
      this.resetForm();
    }
    this.editMode.set(!this.editMode());
  }

  resetForm() {
    if (this.userSubject.value === null) return;
    this.initForm(this.userSubject.value);
  }

  get cv() {
    if (user === null) return;
    return (this.editForm.get('cv')?.value as IFile).name;
  }

  get accountFields() {
    return this.userType() === EUserType.EMPLOYER
      ? this.ACCOUNT_DATA().personalData.concat(this.ACCOUNT_DATA().contactData)
      : this.ACCOUNT_DATA().personalData.concat(this.ACCOUNT_DATA().contactData);
  }

  get isEmployer() {
    return this.userType() === EUserType.EMPLOYER;
  }
}
