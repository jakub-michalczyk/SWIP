import { Routes } from '@angular/router';
import { HomepageComponent } from './features/home/homepage/homepage.component';
import { MoreComponent } from './features/more/more/more.component';

export const routes: Routes = [
  {
    path: 'policies',
    data: {
      headingCode: 'POLICIES',
      view: 'FOOTER',
    },
    children: [
      {
        path: 'terms',
        redirectTo: '/',
        data: {
          titleCode: 'TERMS',
        },
      },
      {
        path: 'privacy-policy',
        redirectTo: '/',
        data: {
          titleCode: 'PRIVACY_POLICY',
        },
      },
    ],
  },
  {
    path: 'more',
    component: MoreComponent,
    pathMatch: 'full',
    data: {
      path: 'more',
      headingCode: 'MORE',
      titleCode: 'FIND_OUT_MORE',
      view: 'FOOTER',
    },
  },
  {
    path: '',
    component: HomepageComponent,
  },
];
