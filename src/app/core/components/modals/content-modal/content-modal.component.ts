import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'swip-modal',
  imports: [],
  template: '',
})
export class ContentModalComponent {
  protected dialogRef = inject(MatDialogRef<ContentModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  accept(): void {}

  cancel(changed: boolean) {
    this.dialogRef.close(changed);
  }
}
