import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IRegulationsData } from './regulations.interface';

@Component({
  selector: 'swip-regulations',
  imports: [TranslateModule],
  templateUrl: './regulations.component.html',
})
export class RegulationsComponent {
  @Input() title = '';
  @Input() data: IRegulationsData[] = [];
}
