import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';

import { environment } from '../../../../environments/enviroment';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { StandaloneService } from '../../../core/services/standalone/standalone.service';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { RegisterFormComponent } from '../../register/register-form/register-form.component';
import { RegisterService } from '../../register/register.service';

@Component({
  selector: 'swip-homepage',
  imports: [
    TopbarComponent,
    MatButtonModule,
    CommonModule,
    TranslateModule,
    RegisterFormComponent,
    IconComponent,
    RouterLink,
  ],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  private installEvent?: BeforeInstallPromptEvent;
  private readonly destroyerRef = inject(DestroyRef);
  isMobile: boolean = false;
  isPWA: boolean = false;
  formExpanded = signal(false);
  emailVerificationSent = false;

  constructor(
    private mobileService: MobileService,
    private standaloneService: StandaloneService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.registerServiceWorker();
    this.setUpPWASub();
    this.setUpMobileServiceSub();
    this.setUpRegisterService();
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

  setUpRegisterService() {
    this.registerService.verificationEmailSent$.subscribe((sent) => (this.emailVerificationSent = sent));
  }

  setUpPWASub() {
    const installPrompt$ = fromEvent<BeforeInstallPromptEvent>(window, 'beforeinstallprompt');

    installPrompt$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((event) => {
      this.installEvent = event; // Catch event
    });

    this.standaloneService.isStandaloneMode$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((value: boolean) => (this.isPWA = value));
  }

  setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  installApp() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent = undefined;
    }
  }

  toggleForm() {
    this.formExpanded.set(!this.formExpanded());
  }
}
