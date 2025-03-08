import { HttpBackend, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { environment } from '../environments/enviroment.example';
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
    provideEnvironmentNgxMask(),
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
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
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
    {
      prefix: 'translation/register/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/errors/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/more/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/terms/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/privacy-policy/',
      suffix: '.json',
      optional: true,
    },
    {
      prefix: 'translation/account/',
      suffix: '.json',
      optional: true,
    },
  ]);
}
