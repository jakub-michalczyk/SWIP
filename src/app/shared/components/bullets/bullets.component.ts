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

  private setUpBulletsSub() {
    this.bulletsService.bullets$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((steps) => {
      this.bullets = steps;
    });
  }

  chooseStep(id: number) {
    if (this.canChooseStep(id)) {
      this.bulletsService.resetBullets(this.bullets);
      this.bullets[id].isActive = true;
      this.bulletsService.updateStepStatus(this.bullets);
    }
  }

  private canChooseStep(id: number): boolean {
    return this.bullets.slice(0, id).every((bullet) => bullet.valid);
  }

  isBulletFilled(bullet: IStep): boolean {
    const active = this.bullets.find((b) => b.isActive);
    return bullet.isActive || (active && bullet.id < active.id) || false;
  }

  isBulletNotValid(bullet: IStep): boolean {
    return this.bullets.slice(0, bullet.id).some((b) => !b.valid);
  }
}
