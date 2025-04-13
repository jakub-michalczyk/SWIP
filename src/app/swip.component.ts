import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/components/footer/footer.component';
import { TopbarComponent } from './core/components/topbar/topbar.component';
import { StandaloneService } from './core/services/standalone/standalone.service';

@Component({
  selector: 'swip-root',
  imports: [CommonModule, FooterComponent, RouterOutlet, TopbarComponent],
  templateUrl: './swip.component.html',
})
export class SwipComponent {
  private readonly destroyerRef = inject(DestroyRef);
  isPWA: boolean = false;

  constructor(private standaloneService: StandaloneService) {
    this.setUpPWASub();
  }

  private setUpPWASub() {
    this.standaloneService.isStandaloneMode$
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((value: boolean) => (this.isPWA = value));
  }
}
