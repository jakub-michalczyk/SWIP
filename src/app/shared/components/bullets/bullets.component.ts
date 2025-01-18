import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IBullet } from './bullets.interface';

@Component({
  selector: 'swip-bullets',
  imports: [CommonModule],
  templateUrl: './bullets.component.html',
})
export class BulletsComponent implements OnInit {
  @Input() steps = 0;
  bullets: IBullet[] = [];

  ngOnInit() {
    for (let i = 0; i < this.steps; i++) {
      this.bullets.push({
        id: i,
        isActive: i === 0 ? true : false,
      });
    }
  }

  chooseStep(id: number) {
    this.bullets.map((bullet) => (bullet.id <= id ? (bullet.isActive = true) : (bullet.isActive = false)));
  }
}
