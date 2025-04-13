import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { from, interval, Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError((error) => {
        console.error('Error during registration:', error);
        throw error;
      })
    );
  }

  sendVerificationEmail(): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(sendEmailVerification(user)).pipe(
        catchError((error) => {
          console.error('Error sending verification email:', error);
          throw error;
        })
      );
    }
    return of(undefined).pipe(
      switchMap(() => {
        throw new Error('No user is logged in');
      })
    );
  }

  waitForEmailVerification(user: User): Observable<User> {
    return interval(2000).pipe(
      switchMap(() => from(user.reload())),
      filter(() => user.emailVerified),
      take(1),
      switchMap(() => of(user)),
      catchError((error) => {
        console.error('Error during email verification check:', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError((error) => {
        console.error('Error during logout:', error);
        throw error;
      })
    );
  }
}
