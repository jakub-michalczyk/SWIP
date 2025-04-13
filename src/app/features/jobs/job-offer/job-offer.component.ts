import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { JobService } from '../job/job.service';
import { EApplicationStatus, EDirection, IJobOffer, IJobOfferDTO } from '../jobs-wrap/jobs-wrap.interface';

@Component({
  selector: 'swip-job-offer',
  imports: [MatIconModule, IconComponent, MatButtonModule, IconComponent, CommonModule, TranslateModule],
  templateUrl: './job-offer.component.html',
  animations: [
    trigger('swipeAnimation', [
      state('left', style({ transform: 'translateX(-100%) rotate(-20deg)', opacity: 0 })),
      state('right', style({ transform: 'translateX(100%) rotate(20deg)', opacity: 0 })),
      transition('* => left', [animate('0.4s ease-out')]),
      transition('* => right', [animate('0.4s ease-out')]),
    ]),
  ],
})
export class JobOfferComponent implements OnInit {
  @ViewChild('offerWrap', { static: false })
  set offerWrap(element: ElementRef | undefined) {
    if (element) {
      setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transform', 'translateY(0)');
      }, 50);
    }
  }
  @ViewChild('offerContainer') offerContainer!: ElementRef;

  _jobData: IJobOfferDTO | null = null;
  get jobData(): IJobOfferDTO | null {
    return this._jobData;
  }

  @Input() set jobData(value: IJobOfferDTO | null) {
    this._jobData = value;
    this.initJobOffer();
  }

  jobOffer: IJobOffer | null = null;
  swipeState: EDirection | null = null;
  gradientColor: string = '';
  isDragging: boolean = false;
  EDirection = EDirection;

  private startX: number = 0;
  private currentX: number = 0;
  private readonly swipeThreshold: number = 120;
  private destroyerRef = inject(DestroyRef);

  constructor(
    private renderer: Renderer2,
    private jobService: JobService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initJobOffer();
  }

  private initJobOffer() {
    if (this.jobData) {
      this.jobService
        .loadCompanyInfo(this.jobData.companyId)
        .pipe(takeUntilDestroyed(this.destroyerRef))
        .subscribe((companyData) => {
          this.jobOffer = {
            ...this.jobData,
            companyImage: companyData?.companyImage ?? 'images/dummy_company.png',
            companyName: companyData?.companyName ?? 'Company name',
          } as IJobOffer;
        });
    }
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.currentX = this.startX;

    this.handleCursorType(true);
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    this.currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const deltaX = this.currentX - this.startX;

    Math.abs(deltaX) > this.swipeThreshold ? this.addGradient(deltaX) : (this.gradientColor = '');

    if (this.offerContainer) {
      this.renderer.setStyle(
        this.offerContainer.nativeElement,
        'transform',
        `translate(${deltaX}px) rotate(${deltaX / 10}deg) scale(1.05)`
      );
    }
  }

  onDragEnd() {
    if (!this.isDragging) return;

    const deltaX = this.currentX - this.startX;
    this.handleCursorType(false);

    if (Math.abs(deltaX) > this.swipeThreshold) {
      this.addGradient(deltaX > 0 ? 1 : -1);
      this.swipeState = deltaX > 0 ? EDirection.RIGHT : EDirection.LEFT;
      this.apply(deltaX);
    } else {
      this.stop();
    }
  }

  onArrowClick(direction: EDirection) {
    const DETERMINE_DELTA_BY_DIRECTION = direction === EDirection.RIGHT ? 1 : -1;

    this.addGradient(DETERMINE_DELTA_BY_DIRECTION);
    this.swipeState = direction;
    this.apply(DETERMINE_DELTA_BY_DIRECTION);
    this.gradientColor = '';
  }

  private addGradient(deltaX: number) {
    this.gradientColor = deltaX > 0 ? 'bg-green-500/30' : 'bg-red-500/30';
    this.cdr.markForCheck();
  }

  private removeOffer() {
    this.jobOffer = null;
    this.swipeState = null;
    this.gradientColor = '';
  }

  private handleCursorType(add: boolean) {
    const CURSOR_TYPE = 'cursor-grabbing';
    if (add) {
      document.body.classList.add(CURSOR_TYPE);
      this.offerContainer.nativeElement.classList.add(CURSOR_TYPE);
    } else {
      document.body.classList.remove(CURSOR_TYPE);
      this.offerContainer.nativeElement.classList.remove(CURSOR_TYPE);
    }
  }

  private apply(deltaX: number) {
    if (this.jobOffer !== null) {
      this.jobService
        .applyToJob(this.jobOffer, deltaX > 0 ? EApplicationStatus.APPLIED : EApplicationStatus.REJECTED)
        .pipe(takeUntilDestroyed(this.destroyerRef))
        .subscribe(() => {
          this.removeOffer();
          this.jobService.needRefresh$.next();
        });
    }

    this.isDragging = false;
  }

  private stop() {
    this.swipeState = null;
    this.gradientColor = '';
    this.renderer.setStyle(this.offerContainer.nativeElement, 'transform', 'translate(0, 0) rotate(0deg) scale(1)');
    this.isDragging = false;
  }
}
