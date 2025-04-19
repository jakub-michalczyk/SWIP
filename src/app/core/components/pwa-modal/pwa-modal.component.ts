import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';
import { ContentModalComponent } from '../modals/content-modal/content-modal.component';

@Component({
  selector: 'swip-pwa-modal',
  imports: [MatButtonModule, TranslateModule, LoaderComponent, MatDialogModule],
  templateUrl: './pwa-modal.component.html',
})
export class PwaModalComponent extends ContentModalComponent {
  loading = signal(true);

  constructor() {
    super();
  }
}
