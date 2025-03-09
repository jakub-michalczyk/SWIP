import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { convertToBase64 } from '../../../core/utils/utils';

@Component({
  selector: 'swip-upload-file',
  imports: [MatError, CommonModule, MatIconModule, TranslateModule],
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  @Input({ required: true }) form = {} as FormGroup;
  @Input({ required: true }) fieldKey = '';
  @Input({ required: true }) beforeUploadCopy = '';
  @Input({ required: true }) errorCopy = '';
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      convertToBase64(file).subscribe({
        next: (base64) => {
          this.form.patchValue({ cv: { name: file.name, value: base64 } });
          this.form.get('cv')?.markAsDirty();
        },
        error: (err) => console.error('Error:', err),
      });
    }
  }
}
