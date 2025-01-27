import { Component, Input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'swip-toggle',
  imports: [MatButtonToggleModule],
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {
  @Input() values: string[] = ['Value 1', 'Value 2'];
}
