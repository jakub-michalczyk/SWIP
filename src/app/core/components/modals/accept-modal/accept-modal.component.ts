import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'swip-modal',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, TranslateModule],
  templateUrl: './accept-modal.component.html',
})
export class AcceptModalComponent {
  protected dialogRef = inject(MatDialogRef<AcceptModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  accepted = signal(false);

  accept(): void {}

  cancel(changed: boolean) {
    this.dialogRef.close(changed);
  }
}
