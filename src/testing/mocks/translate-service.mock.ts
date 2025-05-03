import { EventEmitter } from '@angular/core';
import { InterpolatableTranslationObject, LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export function createMockTranslateService(overrides?: Partial<TranslateService>): TranslateService {
  const onLangChangeEmitter = new EventEmitter<LangChangeEvent>();
  const onDefaultLangChangeEmitter = new EventEmitter<LangChangeEvent>();

  const mock: Partial<TranslateService> = {
    currentLang: 'en',
    defaultLang: 'en',

    onLangChange: onLangChangeEmitter,
    onDefaultLangChange: onDefaultLangChangeEmitter,

    get: jest.fn((key: string | string[]) => of(key)),
    instant: jest.fn((key: string) => key),

    use: jest.fn((lang: string): Observable<InterpolatableTranslationObject> => {
      mock.currentLang = lang;
      onLangChangeEmitter.emit({ lang, translations: {} });
      return of({ [lang]: lang } as InterpolatableTranslationObject);
    }),

    setDefaultLang: jest.fn((lang: string) => {
      mock.defaultLang = lang;
      onDefaultLangChangeEmitter.emit({ lang, translations: {} });
    }),
  };

  if (overrides) {
    Object.assign(mock, overrides);
  }

  return mock as TranslateService;
}
