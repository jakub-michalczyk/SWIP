import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ELanguageCode } from '../../../shared/enums/language.enum';
import { UserService } from '../../../shared/services/user/user.service';
import { ICompany, IUser } from '../../services/auth/auth.interface';

@Component({
  selector: 'swip-language-buttons',
  imports: [MatButtonModule, TranslateModule],
  templateUrl: './language-buttons.component.html',
})
export class LanguageButtonsComponent {
  @Input() accountMode = false;
  @Input() disabled = false;

  private readonly destroyerRef = inject(DestroyRef);
  lang: ELanguageCode = ELanguageCode.EN;
  userData: IUser | ICompany | null = null;

  constructor(
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.getUser();
    this.checkUserLang();
    this.setUpLang();
  }

  private getUser() {
    this.userService
      .getUserData()
      .pipe(takeUntilDestroyed(this.destroyerRef))
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
    if (this.userData !== null && this.userData.uid) {
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
