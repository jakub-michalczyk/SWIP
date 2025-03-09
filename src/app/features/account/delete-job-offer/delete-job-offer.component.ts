import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { CompanyService } from '../../../core/services/company/company.service';

@Component({
  selector: 'swip-delete-job-offer',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, TranslateModule],
  templateUrl: '../../../core/components/modal/modal.component.html',
})
export class DeleteJobOfferComponent extends ModalComponent {
  private destroyerRef = inject(DestroyRef);

  constructor(private companyService: CompanyService) {
    super();
  }

  override accept() {
    this.companyService
      .deleteJobOffer(this.data.jobId)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(() => {
        this.accepted.set(true);
      });
  }
}
