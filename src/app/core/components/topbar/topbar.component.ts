import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StandaloneService } from '../../services/standalone/standalone.service';
import { LanguageButtonsComponent } from '../language-buttons/language-buttons.component';

@Component({
  selector: 'swip-topbar',
  imports: [MatButtonModule, TranslateModule, LanguageButtonsComponent, RouterLink],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly destroyerRef = inject(DestroyRef);
  isPWA = false;

  constructor(private standaloneService: StandaloneService) {
    this.setUpPWASub();
  }

  setUpPWASub() {
    this.standaloneService.isStandaloneMode$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((value: boolean) => {
      this.isPWA = value;
    });
  }
}
