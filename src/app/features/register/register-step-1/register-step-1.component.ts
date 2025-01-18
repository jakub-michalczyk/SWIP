import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'swip-register-step-1',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './register-step-1.component.html',
})
export class RegisterStep1Component {
  @Input({ required: true }) form = {} as FormGroup;
  hide = signal(true);

  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
