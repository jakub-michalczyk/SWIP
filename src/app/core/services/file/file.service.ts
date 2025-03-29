import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFile } from '../auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  convertFileToBase64(file: File | null | undefined): Observable<IFile> {
    return new Observable((observer) => {
      if (!file || !(file instanceof Blob)) {
        observer.error(new TypeError('Invalid file input: Expected a File or Blob.'));
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        observer.next({ name: file.name, value: reader.result as string });
        observer.complete();
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        observer.error(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
