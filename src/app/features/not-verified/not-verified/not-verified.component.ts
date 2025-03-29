import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'swip-not-verified',
  imports: [TranslateModule, MatIcon, CommonModule],
  templateUrl: './not-verified.component.html',
})
export class NotVerifiedComponent {}
