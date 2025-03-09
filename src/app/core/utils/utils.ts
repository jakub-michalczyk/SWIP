import { Observable } from 'rxjs';

export function convertToBase64(file: File): Observable<string> {
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
