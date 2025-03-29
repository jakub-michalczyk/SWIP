import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { ICompany, IUser } from '../auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private destroyerRef = inject(DestroyRef);

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  saveUserData(userId: string, userData: IUser | ICompany): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userDocRef, { uid: userId, ...userData })).pipe(
      takeUntilDestroyed(this.destroyerRef),
      catchError((error) => {
        console.error('Error saving user data:', error);
        throw error;
      })
    );
  }

  getUserData() {
    return user(this.auth).pipe(
      takeUntilDestroyed(this.destroyerRef),
      switchMap((user) => (user ? this.getData(user.uid) : of(null)))
    );
  }

  getData(userId: string): Observable<IUser | ICompany | null> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef)).pipe(
      takeUntilDestroyed(this.destroyerRef),
      map((docSnap) => (docSnap.exists() ? ({ ...docSnap.data(), uid: userId } as IUser) : null)),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );
  }
}
