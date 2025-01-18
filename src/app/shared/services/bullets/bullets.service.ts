import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BulletsService {
  private activeBulletSubject = new BehaviorSubject<number>(0);
  activeBullet$ = this.activeBulletSubject.asObservable();

  setActiveBullet(id: number): void {
    const currentValue = this.activeBulletSubject.getValue();
    if (currentValue !== id) {
      this.activeBulletSubject.next(id);
    }
  }

  getCurrentBullet(): number {
    return this.activeBulletSubject.getValue();
  }
}
