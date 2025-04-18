import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { UserService } from '../../../shared/services/user/user.service';
import { EContractType, EEmploymentType, EWorkMode, IJobOffer } from '../../jobs/jobs-wrap/jobs-wrap.interface';
import { NewOfferModalComponent } from '../new-offer-modal/new-offer-modal.component';

@Component({
  selector: 'swip-new-offer',
  imports: [
    MatCardModule,
    FrameComponent,
    LoaderComponent,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './new-offer.component.html',
})
export class NewOfferComponent {
  private destroyerRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  loading = signal(false);
  newOffer!: FormGroup;
  EWorkMode = EWorkMode;
  EEmploymentType = EEmploymentType;
  EContractType = EContractType;
  maxTagsAdded = signal(false);

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {
    this.setUpNewOfferForm();
  }

  private setUpNewOfferForm() {
    this.newOffer = this.fb.group({
      title: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      workMode: [EWorkMode.ONSITE, [Validators.required]],
      employmentType: [EEmploymentType.FULL_TIME, [Validators.required]],
      salaryFrom: ['', [Validators.required]],
      salaryTo: [''],
      contractType: [EContractType.UOP, [Validators.required]],
      tags: [[], [Validators.required]],
      tagInput: [''],
    });
  }

  addTag(event: Event) {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const tagValue = inputElement.value.trim();

    if (tagValue) {
      const tagsControl = this.newOffer.controls['tags'];
      tagsControl.setValue([...tagsControl.value, tagValue]);
      inputElement.value = '';

      this.checkTags();
    }
  }

  removeTag(tag: string) {
    const tagsControl = this.newOffer.controls['tags'];
    tagsControl.setValue(tagsControl.value.filter((t: string) => t !== tag));
    this.checkTags();
  }

  cancel() {
    this.router.navigate(['/company-offers']);
  }

  private checkTags() {
    this.newOffer.controls['tags'].value.length >= 3 ? this.maxTagsAdded.set(true) : this.maxTagsAdded.set(false);
  }

  addNewOffer(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const buttonElement = document.activeElement as HTMLElement;
    const jobData = Object.fromEntries(Object.entries(this.newOffer.value).filter(([key]) => key !== 'tagInput'));
    buttonElement.blur();

    this.dialog.open(NewOfferModalComponent, {
      width: '70',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titleCode: 'NEW_OFFER',
        messageCode: 'NEW_OFFER_DESC',
        jobData: {
          ...jobData,
          companyId: this.auth.currentUser?.uid,
        } as IJobOffer,
      },
    });
  }
}
