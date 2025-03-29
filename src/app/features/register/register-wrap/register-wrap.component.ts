import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FrameComponent } from '../../../core/components/frame/frame.component';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'swip-register-wrap',
  imports: [RegisterFormComponent, FrameComponent],
  templateUrl: './register-wrap.component.html',
})
export class RegisterWrapComponent {
  isMobile: boolean = false;
  private readonly destroyerRef = inject(DestroyRef);

  constructor(private mobileService: MobileService) {
    this.setUpMobileServiceSub();
  }

  private setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}
