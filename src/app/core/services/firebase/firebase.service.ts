import { Injectable } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../../environments/enviroment.example';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app;
  private analytics;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);

    if (typeof window !== 'undefined') {
      this.analytics = getAnalytics(this.app);
    }
  }
}
