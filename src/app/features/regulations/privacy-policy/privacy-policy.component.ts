import { Component } from '@angular/core';
import { RegulationsComponent } from '../regulations/regulations.component';
import { PRIVACY_POLICY_DATA } from './privacy-policy.data';

@Component({
  selector: 'swip-privacy-policy',
  imports: [RegulationsComponent],
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent {
  privacy_policy = PRIVACY_POLICY_DATA;
}
