import { bootstrapApplication } from '@angular/platform-browser';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { SwipComponent } from './app/swip.component';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { ELanguageCode } from './app/shared/enums/language.enum';

bootstrapApplication(SwipComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory2,
          deps: [HttpBackend],
        },
        defaultLanguage: ELanguageCode.EN,
      })
    ),
  ],
}).catch((err) => console.error(err));

function HttpLoaderFactory2(http: HttpBackend) {
  return new MultiTranslateHttpLoader(http, [
    {
      prefix: 'translation/shared/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/homepage/',
      suffix: '.json',
      optional: true,
    },
  ]);
}
