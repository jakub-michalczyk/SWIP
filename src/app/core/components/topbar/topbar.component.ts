import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signOut } from 'firebase/auth';
import { from } from 'rxjs';
import { StandaloneService } from '../../services/standalone/standalone.service';

@Component({
  selector: 'swip-topbar',
  imports: [MatButtonModule, TranslateModule, RouterLink, CommonModule, MatIconModule, MatMenuModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly destroyerRef = inject(DestroyRef);
  userLoggedIn = signal(false);
  isScrolled = signal(false);

  constructor(
    private standaloneService: StandaloneService,
    private auth: Auth,
    private router: Router
  ) {
    this.setUpUser();
  }

  @HostListener('window:scroll', ['$event'])
  private onWindowScroll() {
    this.isScrolled.set(window.scrollY > 0 ? true : false);
  }

  private setUpUser() {
    user(this.auth)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        return user === null ? this.userLoggedIn.set(false) : this.userLoggedIn.set(true);
      });
  }

  signOut() {
    from(signOut(this.auth))
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(() => this.router.navigate(['/']));
  }
}
