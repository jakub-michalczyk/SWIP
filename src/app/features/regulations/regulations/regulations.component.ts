import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { IRegulationsData } from './regulations.interface';

@Component({
  selector: 'swip-regulations',
  imports: [TranslateModule, TopbarComponent],
  templateUrl: './regulations.component.html',
})
export class RegulationsComponent {
  @Input() title = '';
  @Input() data: IRegulationsData[] = [];
}
