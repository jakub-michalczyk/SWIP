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
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  sendVerificationEmail(): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(sendEmailVerification(user));
    }
    return new Observable<void>((observer) => {
      observer.error('No user is logged in');
      observer.complete();
    });
  }

  waitForEmailVerification(user: User): Observable<User> {
    return new Observable((observer) => {
      const checkVerification = () => {
        user.reload().then(() => {
          if (user.emailVerified) {
            observer.next(user);
            observer.complete();
          } else {
            setTimeout(checkVerification, 2000);
          }
        });
      };

      checkVerification();
    });
  }

  isEmailVerified(): Observable<boolean> {
    const user = this.auth.currentUser;
    return new Observable<boolean>((observer) => {
      if (user) {
        observer.next(user.emailVerified);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  uploadCV(file: File): Observable<string> {
    const storageRef = ref(this.storage, `cv/${file.name}`);
    return from(uploadBytes(storageRef, file)).pipe(switchMap(() => getDownloadURL(storageRef)));
  }

  saveUserData(userId: string, userData: any): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userDocRef, userData));
  }
}
