import { Injectable } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ICompany, IUser } from '../../core/services/auth/auth.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private verificationEmailSentSubject = new BehaviorSubject<boolean>(false);
  verificationEmailSent$ = this.verificationEmailSentSubject.asObservable();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private auth: Auth
  ) {}

  updateStatus(status: boolean) {
    this.verificationEmailSentSubject.next(status);
  }

  checkEmailVerification(userData: IUser | ICompany | null) {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (!user) return [];

        if (user.emailVerified) {
          this.router.navigate(['/']);
        }

        return this.authService.waitForEmailVerification(user);
      }),
      switchMap((user: User) => {
        const isEmployee = Object.prototype.hasOwnProperty.call(userData, 'cv');
        const uploadedFile = isEmployee ? (userData! as IUser).cv : (userData! as ICompany).companyImage;
        const key = isEmployee ? 'cv' : 'companyImage';

        return this.userService.saveUserData(user.uid, {
          ...userData,
          [key]: uploadedFile,
        } as IUser);
      })
    );
  }
}
