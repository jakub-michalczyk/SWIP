import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user, User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { StandaloneService } from '../../services/standalone/standalone.service';
import { LanguageButtonsComponent } from '../language-buttons/language-buttons.component';

@Component({
  selector: 'swip-topbar',
  imports: [MatButtonModule, TranslateModule, LanguageButtonsComponent, RouterLink, CommonModule, MatIconModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly destroyerRef = inject(DestroyRef);
  isPWA = false;
  user$: Observable<User | null> = of(null);

  constructor(
    private standaloneService: StandaloneService,
    private auth: Auth
  ) {
    this.setUpPWASub();
    this.setUpUser();
  }

  setUpPWASub() {
    this.standaloneService.isStandaloneMode$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((value: boolean) => {
      this.isPWA = value;
    });
  }

  setUpUser() {
    this.user$ = user(this.auth);
  }
}
