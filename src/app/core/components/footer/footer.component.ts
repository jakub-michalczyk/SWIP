import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { IconComponent } from '../icon/icon.component';
import { FOOTER_DATA } from './footer.data';
import { IFooterColumn, IFooterLink } from './footer.interface';

@Component({
  selector: 'swip-footer',
  imports: [CommonModule, MatIconModule, IconComponent, RouterModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly destroyerRef = inject(DestroyRef);
  columns: IFooterColumn[] = FOOTER_DATA;
  year = new Date().getFullYear();
  isMobile: boolean = false;

  constructor(private mobileService: MobileService) {
    this.setUpMobileServiceSub();
  }

  setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
      this.setUpMobileData();
    });
  }

  setUpMobileData() {
    if (this.isMobile) {
      const { textLinks, icons } = this.columns.reduce(
        (acc, column) => {
          column.data.forEach((item) => {
            item.isIcon ? acc.icons.push(item) : acc.textLinks.push(item);
          });
          return acc;
        },
        { textLinks: [] as IFooterLink[], icons: [] as IFooterLink[] }
      );

      this.columns = [
        { heading: '', data: textLinks },
        { heading: '', data: icons },
      ];
    } else {
      this.columns = FOOTER_DATA;
    }
  }
}
