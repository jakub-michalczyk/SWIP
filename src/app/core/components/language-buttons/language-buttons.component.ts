import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, switchMap } from 'rxjs';
import { ELanguageCode } from '../../../shared/enums/language.enum';
import { IUser } from '../../services/auth/auth.interface';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'swip-language-buttons',
  imports: [MatButtonModule, TranslateModule],
  templateUrl: './language-buttons.component.html',
})
export class LanguageButtonsComponent {
  @Input() accountMode = false;
  private readonly destroyerRef = inject(DestroyRef);
  lang: ELanguageCode = ELanguageCode.EN;
  userData: IUser | null = null;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private auth: Auth
  ) {
    this.getUser();
    this.checkUserLang();
    this.setUpLang();
  }

  getUser() {
    user(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        switchMap((user) => {
          if (!user) return of(null);

          return this.userService.getUserData(user.uid);
        })
      )
      .subscribe((userData) => {
        this.userData = userData;
        this.checkUserLang();
      });
  }

  checkUserLang() {
    if (this.userData !== null && this.userData.lang !== undefined) {
      this.switchLanguage(this.userData.lang);
    }
  }

  setUpLang() {
    this.lang = (this.translate.currentLang as ELanguageCode) || (this.translate.defaultLang as ELanguageCode);
    this.translate.onDefaultLangChange.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((langData) => {
      this.lang = langData.lang as ELanguageCode;
    });
  }

  updateUserLanguage(lang: ELanguageCode) {
    if (this.userData !== null) {
      this.userService.saveUserData(this.userData.uid, { ...this.userData, lang: lang });
    }
  }

  switchLanguage(language: string): void {
    const lang = language as ELanguageCode;

    if (this.accountMode && language !== this.userData?.lang) {
      this.updateUserLanguage(lang);
    }

    this.translate.setDefaultLang(lang);
  }
}
