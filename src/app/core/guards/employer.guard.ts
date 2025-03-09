import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EUserType } from '../services/auth/auth.interface';

@Injectable({ providedIn: 'root' })
export class EmployerGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return from([false]);
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists() && docSnap.data()['userType'] === EUserType.EMPLOYER) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        this.router.navigate(['/']);
        return from([false]);
      })
    );
  }
}
