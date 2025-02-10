import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { UploadImageComponent } from '../../../core/components/upload-image/upload-image.component';

@Component({
  selector: 'swip-register-step-employer-3',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    UploadImageComponent,
  ],
  templateUrl: './register-step-employer-3.component.html',
})
export class RegisterStepEmployer3Component {
  @Input({ required: true }) form = {} as FormGroup;
}
