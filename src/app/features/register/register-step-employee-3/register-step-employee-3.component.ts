import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { UploadFileComponent } from '../../../shared/components/upload-file/upload-file.component';

@Component({
  selector: 'swip-register-step-employee-3',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    UploadFileComponent,
    TranslateModule,
  ],
  templateUrl: './register-step-employee-3.component.html',
})
export class RegisterStepEmployee3Component {
  @Input({ required: true }) form = {} as FormGroup;
}
