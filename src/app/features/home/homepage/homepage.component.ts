import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/enviroment';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
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

  constructor(
    private mobileService: MobileService,
    private standaloneService: StandaloneService,
    private registerService: RegisterService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.registerServiceWorker();
    this.setUpMobileServiceSub();
    this.setUpPWASub();
    this.setUpRegisterService();
    this.setUpLoader();
  }

  private setUpLoader() {
    if (document.readyState === 'complete') {
      this.loading.set(false);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.loading.set(false);
        }, 100);
      });
    }
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
    this.standaloneService.installApp();
  }

  toggleForm() {
    this.formExpanded.set(!this.formExpanded());
  }

  scrollToSection(targetSection: HTMLDivElement) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
