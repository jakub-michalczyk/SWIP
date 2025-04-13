import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { AcceptModalComponent } from '../../../core/components/modals/accept-modal/accept-modal.component';
import { CompanyService } from '../../../shared/services/company/company.service';

@Component({
  selector: 'swip-new-offer-modal',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, TranslateModule],
  templateUrl: '../../../core/components/modals/accept-modal/accept-modal.component.html',
})
export class NewOfferModalComponent extends AcceptModalComponent {
  private destroyerRef = inject(DestroyRef);

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {
    super();
  }

  override accept() {
    this.companyService
      .addJobOffer(this.data.jobData)
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        catchError((error) => {
          this.dialogRef.close();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.dialogRef.close();
        this.router.navigate(['/company-offers']);
      });
  }
}
