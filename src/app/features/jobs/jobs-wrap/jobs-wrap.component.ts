import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { TranslateModule } from '@ngx-translate/core';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, combineLatest, map, scan, startWith } from 'rxjs';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { LoaderComponent } from '../../../core/components/loader/loader.component';
import { JobOfferComponent } from '../job-offer/job-offer.component';
import { JobService, OFFERS_PER_REQUEST } from '../job/job.service';
import { IJobOfferDTO } from './jobs-wrap.interface';

@Component({
  selector: 'swip-jobs-wrap',
  imports: [JobOfferComponent, CommonModule, FrameComponent, LoaderComponent, TranslateModule],
  templateUrl: './jobs-wrap.component.html',
})
export class JobsWrapComponent {
  private destroyerRef = inject(DestroyRef);
  private jobs$ = new BehaviorSubject<IJobOfferDTO[]>([]);
  private currentOfferId$ = new BehaviorSubject<number>(0);
  loading = signal(true);
  blocked = false;

  currentOffer$ = combineLatest([this.jobs$, this.currentOfferId$]).pipe(
    map(([offers, index]) => (offers.length > index ? offers[index] : null))
  );

  constructor(
    private auth: Auth,
    private jobService: JobService
  ) {
    this.setUpCurrentOfferIdSub();
    onAuthStateChanged(this.auth, (user: User | null) => (user ? this.initOffers() : null));
  }

  setUpCurrentOfferIdSub() {
    this.jobService.needRefresh$
      .pipe(
        takeUntilDestroyed(this.destroyerRef),
        scan((index) => {
          const newIndex = index + 1;
          if (newIndex === OFFERS_PER_REQUEST - 1) {
            this.initOffers();
            return 0;
          }
          return newIndex;
        }, 0),
        startWith(0)
      )
      .subscribe(this.currentOfferId$);
  }

  initOffers() {
    this.loading.set(true);
    this.jobService
      .loadJobOffers()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((offers) => {
        this.jobs$.next(offers);
        this.loading.set(false);
      });
  }
}
