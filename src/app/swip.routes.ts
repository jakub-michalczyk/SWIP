import { Routes } from '@angular/router';
import { SwipComponent } from './swip.component';

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
    redirectTo: '/',
    pathMatch: 'full',
    data: {
      headingCode: 'MORE',
      titleCode: 'FIND_OUT_MORE',
      view: 'FOOTER',
    },
  },
  {
    path: '',
    component: SwipComponent,
  },
];
