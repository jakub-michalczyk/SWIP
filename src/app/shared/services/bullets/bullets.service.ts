import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IStep } from '../../../features/register/register-form/register-form.interface';

@Injectable({
  providedIn: 'root',
})
export class BulletsService {
  private bulletsSubject = new BehaviorSubject<IStep[]>([]);
  bullets$ = this.bulletsSubject.asObservable();

  updateStepStatus(steps: IStep[]) {
    this.bulletsSubject.next(steps);
  }

  getCurrentBullet(): IStep[] {
    return this.bulletsSubject.getValue();
  }

  resetBullets(steps: IStep[]) {
    steps.forEach((s) => (s.isActive = false));
  }
}
