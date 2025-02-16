import { Component } from '@angular/core';
import { RegulationsComponent } from '../regulations/regulations.component';
import { TERMS_DATA } from './terms.data';

@Component({
  selector: 'swip-terms',
  imports: [RegulationsComponent],
  templateUrl: './terms.component.html',
})
export class TermsComponent {
  terms = TERMS_DATA;
}
