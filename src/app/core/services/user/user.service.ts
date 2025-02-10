import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { catchError, from, Observable } from 'rxjs';
import { ICompany, IUser } from '../auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  saveUserData(userId: string, userData: IUser | ICompany): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userDocRef, userData)).pipe(
      catchError((error) => {
        console.error('Error saving user data:', error);
        throw error;
      })
    );
  }
}
