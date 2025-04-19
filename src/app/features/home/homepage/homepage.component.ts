import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/enviroment';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { PwaModalComponent } from '../../../core/components/pwa-modal/pwa-modal.component';
import { StandaloneService } from '../../../core/services/standalone/standalone.service';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { RegisterFormComponent } from '../../register/register-form/register-form.component';
import { RegisterService } from '../../register/register.service';
import { HOMEPAGE_SECTIONS } from './homepage.data';
import { IHomepageSection } from './homepage.interface';

@Component({
  selector: 'swip-homepage',
  imports: [
    MatButtonModule,
    CommonModule,
    TranslateModule,
    RegisterFormComponent,
    IconComponent,
    RouterLink,
    MatIconModule,
    LoaderComponent,
  ],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  private readonly destroyerRef = inject(DestroyRef);
  sections: IHomepageSection[] = HOMEPAGE_SECTIONS;
  isMobile: boolean = false;
  formExpanded = signal(false);
  emailVerificationSent = false;
  isPWA = signal(false);
  loading = signal(true);
  readonly dialog = inject(MatDialog);

  constructor(
    private mobileService: MobileService,
    private standaloneService: StandaloneService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.loading.set(true);
    this.registerServiceWorker();
    this.setUpMobileServiceSub();
    this.setUpPWASub();
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

  private setUpRegisterService() {
    this.registerService.verificationEmailSent$.subscribe((sent) => (this.emailVerificationSent = sent));
  }

  private setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  private setUpPWASub() {
    this.standaloneService.isStandaloneMode$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((value: boolean) => this.isPWA.set(value));
  }

  installApp() {
    if (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document)
    ) {
      const buttonElement = document.activeElement as HTMLElement;
      buttonElement.blur();

      this.dialog.open(PwaModalComponent, {
        width: '90%',
        height: '90%',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
      });
    } else {
      this.standaloneService.installApp();
    }
  }

  toggleForm() {
    this.formExpanded.set(!this.formExpanded());
  }

  scrollToSection(targetSection: HTMLDivElement) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
