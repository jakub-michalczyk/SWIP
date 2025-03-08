import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { ICompany, IUser } from '../auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  saveUserData(userId: string, userData: IUser | ICompany): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userDocRef, { uid: userId, ...userData })).pipe(
      catchError((error) => {
        console.error('Error saving user data:', error);
        throw error;
      })
    );
  }

  getUserData(userId: string): Observable<IUser | null> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnap) => (docSnap.exists() ? (docSnap.data() as IUser) : null)),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );
  }
}
