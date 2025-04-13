import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { deleteUser } from 'firebase/auth';
import { tap } from 'rxjs';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { ICompany, IUser } from '../../../core/services/auth/auth.interface';
import { RegisterService } from '../../register/register.service';
import { NotVerifiedComponent } from '../not-verified/not-verified.component';

@Component({
  selector: 'swip-not-verified-wrap',
  imports: [
    NotVerifiedComponent,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MatCardModule,
    RouterLink,
    LoaderComponent,
  ],
  templateUrl: './not-verified-wrap.component.html',
})
export class NotVerifiedWrapComponent {
  private readonly destroyerRef = inject(DestroyRef);
  userData: IUser | ICompany | null = null;
  userExist = signal(true);
  loading = signal(false);

  constructor(
    private registerService: RegisterService,
    private auth: Auth,
    private router: Router
  ) {
    this.getCachedUserData();
    this.init();
  }

  private getCachedUserData() {
    const data = localStorage.getItem('pendingUserData');
    if (data) {
      this.userData = JSON.parse(data || '');
    } else {
      this.userExist.set(false);
    }
  }

  private init() {
    if (this.userData !== null) {
      this.registerService
        .checkEmailVerification(this.userData)
        .pipe(
          takeUntilDestroyed(this.destroyerRef),
          tap(() => this.loading.set(true))
        )
        .subscribe(() => {
          this.router.navigate(['/']);
          this.loading.set(false);
        });
    } else {
      user(this.auth)
        .pipe(
          takeUntilDestroyed(this.destroyerRef),
          tap(() => this.loading.set(true))
        )
        .subscribe((user) => {
          if (user !== null) {
            this.userExist.set(false);
            deleteUser(user);
          }
          this.loading.set(false);
        });
    }
  }
}
