import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signOut } from 'firebase/auth';
import { StandaloneService } from '../../services/standalone/standalone.service';
import { LanguageButtonsComponent } from '../language-buttons/language-buttons.component';

@Component({
  selector: 'swip-topbar',
  imports: [
    MatButtonModule,
    TranslateModule,
    LanguageButtonsComponent,
    RouterLink,
    CommonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly destroyerRef = inject(DestroyRef);
  isPWA = false;
  userLoggedIn = signal(false);

  constructor(
    private standaloneService: StandaloneService,
    private auth: Auth,
    private router: Router
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
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        return user === null ? this.userLoggedIn.set(false) : this.userLoggedIn.set(true);
      });
  }

  signOut() {
    signOut(this.auth);
    this.router.navigate(['/']);
  }
}
