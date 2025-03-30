import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'swip-loader',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {}
