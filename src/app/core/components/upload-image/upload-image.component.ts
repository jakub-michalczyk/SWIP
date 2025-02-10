import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'swip-upload-image',
  imports: [MatIcon],
  templateUrl: './upload-image.component.html',
})
export class UploadImageComponent {
  @Input({ required: true }) form = {} as FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);

      this.convertToBase64(file).subscribe({
        next: (base64) => this.form.patchValue({ companyImage: base64 }),
        error: (err) => console.error('Error:', err),
      });
    }
  }

  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = (error) => observer.error(error);
    });
  }
}
