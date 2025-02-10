import { Component, Input } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { IToggleElement } from '../../services/toggle/toggle.interface';
import { ToggleService } from '../../services/toggle/toggle.service';

@Component({
  selector: 'swip-toggle',
  imports: [MatButtonToggleModule, TranslateModule],
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {
  @Input() values: IToggleElement[] = [];

  constructor(private toggleService: ToggleService) {}

  onChange(event: MatButtonToggleChange) {
    this.values = this.values.map((value) => ({
      ...value,
      isActive: value.id === Number(event.value),
    }));

    this.toggleService.updateStepStatus(this.values);
  }
}
