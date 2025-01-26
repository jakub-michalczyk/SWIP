import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IStep } from '../../../features/register/register-form/register-form.interface';
import { BulletsService } from '../../services/bullets/bullets.service';

@Component({
  selector: 'swip-bullets',
  imports: [CommonModule],
  templateUrl: './bullets.component.html',
})
export class BulletsComponent {
  private destroyerRef = inject(DestroyRef);
  bullets: IStep[] = [];

  constructor(private bulletsService: BulletsService) {
    this.setUpBulletsSub();
  }

  setUpBulletsSub() {
    this.bulletsService.bullets$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((steps) => {
      this.bullets = steps;
    });
  }

  chooseStep(id: number) {
    for (let i = 0; i < id; i++) {
      if (!this.bullets[i].valid) {
        return;
      }
    }
    this.bulletsService.resetBullets(this.bullets);
    this.bullets[id].isActive = true;
    this.bulletsService.updateStepStatus(this.bullets);
  }

  updateBullets(activeId: number) {
    this.bullets = this.bullets.map((bullet) => ({
      ...bullet,
      isActive: bullet.id === activeId,
    }));
  }

  isBulletFilled(bullet: IStep) {
    const active = this.bullets.find((b) => b.isActive)!;
    return bullet.isActive || bullet.id < active.id;
  }

  isBulletNotValid(bullet: IStep) {
    for (let i = 0; i < bullet.id; i++) {
      if (!this.bullets[i].valid) {
        return true;
      }
    }
    return false;
  }
}
