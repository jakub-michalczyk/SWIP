import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  provideAppInitializer,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './swip.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { InitializeService } from './core/services/initialize/initialize.service';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ELanguageCode } from './shared/enums/language.enum';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(),
    provideAppInitializer(() => inject(InitializeService).initializeApp()),
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
};

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
