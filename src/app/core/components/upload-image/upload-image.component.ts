import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { convertToBase64 } from '../../utils/utils';

@Component({
  selector: 'swip-upload-image',
  imports: [MatIcon, CommonModule],
  templateUrl: './upload-image.component.html',
})
export class UploadImageComponent {
  @Input({ required: true }) form = {} as FormGroup;
  @Input() accountMode = false;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);

      convertToBase64(file).subscribe({
        next: (base64) => {
          this.form.patchValue({ companyImage: base64 });
          this.form.get('companyImage')?.markAsDirty();
        },
        error: (err) => console.error('Error:', err),
      });
    }
  }
}
