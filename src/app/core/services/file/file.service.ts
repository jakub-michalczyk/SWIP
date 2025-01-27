import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private firestore: Firestore) {}

  saveFileToFirestore(file: File, userId: string): Observable<void> {
    return this.convertFileToBase64(file).pipe(
      switchMap((base64Data) => {
        const userDocRef = doc(this.firestore, `users/${userId}`);
        return from(updateDoc(userDocRef, { cv: base64Data }));
      })
    );
  }

  convertFileToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result as string);
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
