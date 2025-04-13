import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { catchError, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { ICompany, IUser } from '../../../core/services/auth/auth.interface';

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

    if (this.isCompany(userData)) {
      const { companyName, companyImage, ...privateData } = userData;
      const publicDocRef = doc(this.firestore, `users/${userId}/public/info`);

      const privatePayload = { uid: userId, ...privateData };
      const publicPayload = { companyName, companyImage };

      const privateDoc$ = from(setDoc(userDocRef, privatePayload));
      const publicDoc$ = from(setDoc(publicDocRef, publicPayload));

      return forkJoin([privateDoc$, publicDoc$]).pipe(
        map(() => void 0),
        takeUntilDestroyed(this.destroyerRef),
        catchError((error) => {
          console.error('Error saving company data:', error);
          throw error;
        })
      );
    } else {
      const privatePayload = { uid: userId, ...userData };
      return from(setDoc(userDocRef, privatePayload)).pipe(
        takeUntilDestroyed(this.destroyerRef),
        catchError((error) => {
          console.error('Error saving user data:', error);
          throw error;
        })
      );
    }
  }

  private isCompany(data: IUser | ICompany): data is ICompany {
    return 'companyName' in data && 'companyImage' in data;
  }

  getUserData() {
    return user(this.auth).pipe(
      takeUntilDestroyed(this.destroyerRef),
      switchMap((user) => (user ? this.getData(user.uid) : of(null)))
    );
  }

  getData(userId: string): Observable<IUser | ICompany | null> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const publicDocRef = doc(this.firestore, `users/${userId}/public/info`);

    const userDoc$ = from(getDoc(userDocRef));
    const publicDoc$ = from(getDoc(publicDocRef));

    return forkJoin([userDoc$, publicDoc$]).pipe(
      takeUntilDestroyed(this.destroyerRef),
      map(([userSnap, publicSnap]) => {
        if (!userSnap.exists()) return null;

        const baseData = { ...userSnap.data(), uid: userId };

        if (publicSnap.exists()) {
          const publicData = publicSnap.data();
          return {
            ...baseData,
            ...publicData,
          } as ICompany;
        }

        return baseData as IUser;
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );
  }
}
