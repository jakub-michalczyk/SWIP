import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StandaloneService {
  private isStandaloneSubject = new BehaviorSubject<boolean>(this.checkIfPwa());

  constructor() {
    this.checkIfPwa();
  }

  private checkIfPwa() {
    const mqStandAlone = '(display-mode: standalone)';
    const isStandalone = window.matchMedia(mqStandAlone).matches;
    const isDevMode = this.getCookie('isPWA') === 'true'; // REMOVE AFTER GOING TO PROD
    return isStandalone || isDevMode;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  get isStandaloneMode$() {
    return this.isStandaloneSubject.asObservable();
  }
}
