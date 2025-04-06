import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { CompanyService } from '../../../core/services/company/company.service';
import { UserService } from '../../../core/services/user/user.service';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { DeleteJobOfferComponent } from '../../company/delete-job-offer/delete-job-offer.component';
import { EDirection, ICompanyOffers } from '../../jobs/jobs-wrap/jobs-wrap.interface';
import { ViewApplicationComponent } from '../view-application/view-application.component';

@Component({
  selector: 'swip-company-offers',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    TranslateModule,
    CommonModule,
    IconComponent,
    MatIconModule,
    MatPaginatorModule,
    FrameComponent,
    MatCardModule,
    LoaderComponent,
    RouterLink,
  ],
  templateUrl: './company-offers.component.html',
})
export class CompanyOffersComponent {
  private destroyerRef = inject(DestroyRef);
  readonly panelOpenState = signal(false);
  readonly dialog = inject(MatDialog);
  dialogWidth = '50%';

  jobOffers$: Observable<ICompanyOffers | null> = of(null);
  totalJobOffersCount: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  EDirection = EDirection;
  isMobile = false;

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private mobileService: MobileService
  ) {
    this.getCompanyJobOffers();
    this.setUpMobileSub();
  }

  private getCompanyJobOffers(direction?: EDirection) {
    this.jobOffers$ = this.userService.getUserData().pipe(
      takeUntilDestroyed(this.destroyerRef),
      switchMap((userData) => {
        if (userData?.uid) {
          return this.companyService.getCompanyData(userData.uid, this.currentPage, this.pageSize, direction).pipe(
            map(({ offers, totalCount }) => {
              this.totalJobOffersCount = totalCount;
              return { offers, totalCount };
            })
          );
        }
        return of({ offers: [], totalCount: 0 });
      })
    );
  }

  private setUpMobileSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
      isMobile ? (this.dialogWidth = '90%') : (this.dialogWidth = '50%');
    });
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

  viewApplications(enterAnimationDuration: string, exitAnimationDuration: string, id: string) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.dialog.open(ViewApplicationComponent, {
      width: this.dialogWidth,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id,
      },
    });
  }

  onPageChange(event: PageEvent) {
    const previousPage = this.currentPage;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCompanyJobOffers(this.currentPage > previousPage ? EDirection.RIGHT : EDirection.LEFT);
  }
}
