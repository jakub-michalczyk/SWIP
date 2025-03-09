import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, switchMap } from 'rxjs';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { CompanyService } from '../../../core/services/company/company.service';
import { UserService } from '../../../core/services/user/user.service';
import { IJobOffer } from '../../jobs/jobs-wrap/jobs-wrap.interface';
import { DeleteJobOfferComponent } from '../delete-job-offer/delete-job-offer.component';

@Component({
  selector: 'swip-company-offers',
  imports: [
    TopbarComponent,
    MatExpansionModule,
    MatButtonModule,
    TranslateModule,
    CommonModule,
    IconComponent,
    MatIconModule,
  ],
  templateUrl: './company-offers.component.html',
})
export class CompanyOffersComponent {
  private destroyerRef = inject(DestroyRef);
  readonly panelOpenState = signal(false);
  readonly dialog = inject(MatDialog);

  dialogWidth = '50%';
  jobOffers$: Observable<IJobOffer[] | null> = of(null);

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router
  ) {
    this.getCompanyJobOffers();
  }

  private getCompanyJobOffers() {
    this.jobOffers$ = this.userService.getUserData().pipe(
      takeUntilDestroyed(this.destroyerRef),
      switchMap((userData) => (userData && userData.uid ? this.companyService.getCompanyData(userData.uid) : of(null)))
    );
  }

  remove(enterAnimationDuration: string, exitAnimationDuration: string, id: string) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this.dialog.open(DeleteJobOfferComponent, {
      width: this.dialogWidth,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titleCode: 'DELETING_JOB_OFFER',
        messageCode: 'DELETE_JOB_OFFER',
        afterAcceptMessageCode: 'OFFER_DELETED',
        jobId: id,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((changed) => {
        if (changed) {
          this.getCompanyJobOffers();
        }
      });
  }

  back() {
    this.router.navigate(['/account']);
  }
}
