import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
      this.form.patchValue({ cv: file });
    }
  }
}
