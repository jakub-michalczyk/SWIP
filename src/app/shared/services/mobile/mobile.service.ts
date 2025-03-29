import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MobileService {
  private mobileQuery = '(min-width: 768px)';
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIfMobile());
  private destroyerRef = inject(DestroyRef);

  constructor() {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(() => {
        this.isMobileSubject.next(this.checkIfMobile());
      });
  }

  private checkIfMobile(): boolean {
    const isSmallScreen = !window.matchMedia(this.mobileQuery).matches;
    const userAgent = navigator.userAgent;
    const isMobileUserAgent = /android|iphone|ipad|iPod/i.test(userAgent);

    // If user is in fact a mobile user or we resize window in the browser
    return (isSmallScreen && isMobileUserAgent) || (isSmallScreen && !isMobileUserAgent);
  }

  get isMobile$() {
    return this.isMobileSubject.asObservable();
  }
}
