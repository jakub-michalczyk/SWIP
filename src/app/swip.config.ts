import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { InitializeService } from './core/services/initialize/initialize.service';
import { ELanguageCode } from './shared/enums/language.enum';
import { routes } from './swip.routes';

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
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
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
