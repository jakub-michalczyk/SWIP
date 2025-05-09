import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { IIcon } from '../../model/icon.model';
import { NavigationService } from '../../services/navigation/navigation.service';
import { IconComponent } from '../icon/icon.component';
import { LanguageButtonsComponent } from '../language-buttons/language-buttons.component';
import { FOOTER_DATA } from './footer.data';
import { IFooterColumn, IFooterLink } from './footer.interface';

@Component({
  selector: 'swip-footer',
  imports: [
    CommonModule,
    MatIconModule,
    IconComponent,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    LanguageButtonsComponent,
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly destroyerRef = inject(DestroyRef);
  columns: IFooterColumn[] = [];
  year = new Date().getFullYear();
  isMobile: boolean = false;

  constructor(
    private mobileService: MobileService,
    private navigationService: NavigationService
  ) {
    this.setUpNavSub();
    this.setUpMobileServiceSub();
  }

  private setUpNavSub() {
    this.navigationService.footerRoutes$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((navData) => {
      this.getMenuData(navData);
    });
  }

  private getMenuData(navData: Route[]) {
    navData.forEach((d) => {
      const footerLinks =
        d.children && d.children.length > 0
          ? d.children.map((child) => ({
              ...child.data,
              path: `${d.path}/${child.path}`,
            }))
          : [
              {
                ...d.data,
                path: `/${d.path}`,
              },
            ];

      this.columns.push({
        headingCode: d.data?.['headingCode'] || '',
        data: footerLinks as IFooterLink[],
      });
    });

    this.columns.splice(1, 0, FOOTER_DATA);
  }

  private setUpMobileServiceSub() {
    this.mobileService.isMobile$.pipe(takeUntilDestroyed(this.destroyerRef)).subscribe((isMobile) => {
      this.isMobile = isMobile;
      this.setUpMobileData();
    });
  }

  private setUpMobileData() {
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
        { headingCode: '', data: textLinks },
        { headingCode: '', data: icons },
      ];
    } else {
      this.navigationService.footerRoutes$.pipe(take(1), takeUntilDestroyed(this.destroyerRef)).subscribe((navData) => {
        this.columns = [];
        this.getMenuData(navData);
      });
    }
  }

  getIcon(link: IFooterLink) {
    return { value: link.translationCode } as IIcon;
  }
}
