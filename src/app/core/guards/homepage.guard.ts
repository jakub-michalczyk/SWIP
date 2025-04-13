import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomepageGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return user(this.auth).pipe(
      map((currentUser) => {
        if (currentUser) {
          this.router.navigate(['/jobs']);
          return false;
        }
        return true;
      })
    );
  }
}
