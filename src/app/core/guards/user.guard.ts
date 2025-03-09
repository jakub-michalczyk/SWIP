import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.router.navigate(['/']);
          observer.next(false);
        } else {
          observer.next(true);
        }
        observer.complete();
      });
    });
  }
}
