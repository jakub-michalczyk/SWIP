import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'swip-email-password',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './email-password.component.html',
})
export class EmailPasswordComponent {
  @Input({ required: true }) form = {} as FormGroup;
  @Input() validationOn = true;
  hide = signal(true);

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
