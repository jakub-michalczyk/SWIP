import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BulletsService } from '../../services/bullets/bullets.service';
import { IBullet } from './bullets.interface';

@Component({
  selector: 'swip-bullets',
  imports: [CommonModule],
  templateUrl: './bullets.component.html',
})
export class BulletsComponent implements OnInit {
  private destroyerRef = inject(DestroyRef);
  @Input() steps = 0;
  bullets: IBullet[] = [];

  constructor(private bulletsService: BulletsService) {
    this.setUpBulletsSub();
  }

  ngOnInit() {
    for (let i = 0; i < this.steps; i++) {
      this.bullets.push({
        id: i,
        isActive: i === 0 ? true : false,
      });
    }
  }

  setUpBulletsSub() {
    this.bulletsService.activeBullet$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((activeId) => {
      this.chooseStep(activeId);
    });
  }

  chooseStep(id: number) {
    this.bullets = this.bullets.map((bullet) => ({
      ...bullet,
      isActive: bullet.id <= id,
    }));
    this.bulletsService.setActiveBullet(id);
  }
}
