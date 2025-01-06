import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { fromEvent } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TopbarComponent } from './core/components/topbar/topbar.component';
import { MobileService } from './shared/services/mobile/mobile.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'swip-root',
  imports: [
    ServiceWorkerModule,
    MatButtonModule,
    TopbarComponent,
    CommonModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './swip.component.html',
})
export class SwipComponent implements OnInit {
  private installEvent?: BeforeInstallPromptEvent;
  private readonly destroyerRef = inject(DestroyRef);
  isMobile: boolean = false;

  constructor(private mobileService: MobileService) {}

  ngOnInit() {
    this.registerServiceWorker();
    this.setUpPWASub();
    this.setUpMobileServiceSub();
  }

  registerServiceWorker() {
    if (environment.production) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('ngsw-worker.js')
          .then((registration) => {
            console.log('Service Worker registered', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration error', error);
          });
      }
    }
  }

  setUpPWASub() {
    const installPrompt$ = fromEvent<BeforeInstallPromptEvent>(
      window,
      'beforeinstallprompt'
    );

    installPrompt$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((event) => {
        this.installEvent = event; // Catch event
      });
  }

  setUpMobileServiceSub() {
    this.mobileService.isMobile$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
  }

  installApp() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent = undefined;
    }
  }
}
