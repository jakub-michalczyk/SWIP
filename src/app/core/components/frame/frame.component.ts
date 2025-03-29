import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'swip-frame',
  imports: [CommonModule, TranslateModule],
  templateUrl: './frame.component.html',
})
export class FrameComponent {
  @Input() disablePadding = false;
}
