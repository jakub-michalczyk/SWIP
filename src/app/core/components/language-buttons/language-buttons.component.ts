import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ELanguageCode } from '../../../shared/enums/language.enum';

@Component({
  selector: 'swip-language-buttons',
  imports: [MatButtonModule, TranslateModule],
  templateUrl: './language-buttons.component.html',
})
export class LanguageButtonsComponent {
  private readonly destroyerRef = inject(DestroyRef);
  lang: ELanguageCode = ELanguageCode.EN;

  constructor(private translate: TranslateService) {
    this.setUpLang();
  }

  setUpLang() {
    this.lang = (this.translate.currentLang as ELanguageCode) || (this.translate.defaultLang as ELanguageCode);
    this.translate.onDefaultLangChange.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((langData) => {
      this.lang = langData.lang as ELanguageCode;
    });
  }

  switchLanguage(language: string): void {
    this.translate.setDefaultLang(language);
  }
}
