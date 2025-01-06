import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ELanguageCode } from '../../../shared/enums/language.enum';

@Component({
  selector: 'swip-topbar',
  imports: [MatButtonModule, TranslateModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly destroyRef = inject(DestroyRef);
  lang: ELanguageCode = ELanguageCode.EN;

  constructor(private translate: TranslateService) {
    this.setUpLang();
  }

  setUpLang() {
    this.lang =
      (this.translate.currentLang as ELanguageCode) ||
      (this.translate.defaultLang as ELanguageCode);
    this.translate.onDefaultLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((langData) => {
        this.lang = langData.lang as ELanguageCode;
      });
  }

  switchLanguage(language: string): void {
    this.translate.setDefaultLang(language);
  }
}
