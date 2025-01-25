import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IIcon } from '../../model/icon.model';

@Component({
  selector: 'swip-icon',
  imports: [MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './icon.component.html',
})
export class IconComponent {
  @Input() icon = {} as IIcon;
  @Input() isButton?: boolean = false;

  classNames = '!w-full !h-full !text-[length:inherit] !text-inherit';
}
