import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { ExpandOnViewDirective } from '../../../core/directives/expand-on-view.directive';

@Component({
  selector: 'swip-more',
  imports: [TopbarComponent, CommonModule, MatButtonModule, TranslateModule, ExpandOnViewDirective],
  templateUrl: './more.component.html',
})
export class MoreComponent {}
