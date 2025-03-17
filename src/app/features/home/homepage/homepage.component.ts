import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/enviroment';
import { IconComponent } from '../../../core/components/icon/icon.component';
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
  ],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  @ViewChild('about') targetSection!: ElementRef;
  private readonly destroyerRef = inject(DestroyRef);

  sections: IHomepageSection[] = HOMEPAGE_SECTIONS;
  isMobile: boolean = false;
  formExpanded = signal(false);
  emailVerificationSent = false;

  constructor(
    private mobileService: MobileService,
    private standaloneService: StandaloneService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.registerServiceWorker();
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

  setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  installApp() {
    this.standaloneService.installApp();
  }

  toggleForm() {
    this.formExpanded.set(!this.formExpanded());
  }

  scrollToSection() {
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
