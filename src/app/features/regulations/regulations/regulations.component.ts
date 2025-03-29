import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { IRegulationsData } from './regulations.interface';

@Component({
  selector: 'swip-regulations',
  imports: [TranslateModule, FrameComponent],
  templateUrl: './regulations.component.html',
})
export class RegulationsComponent {
  @Input() title = '';
  @Input() data: IRegulationsData[] = [];
}
