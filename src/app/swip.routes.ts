import { Routes } from '@angular/router';
import { EmployerGuard } from './core/guards/employer.guard';
import { UserGuard } from './core/guards/user.guard';
import { AccountComponent } from './features/account/account/account.component';
import { CompanyOffersComponent } from './features/company/company-offers/company-offers.component';
import { HomepageComponent } from './features/home/homepage/homepage.component';
import { LoginComponent } from './features/login/login/login.component';
import { MoreComponent } from './features/more/more/more.component';
import { RegisterWrapComponent } from './features/register/register-wrap/register-wrap.component';
import { PrivacyPolicyComponent } from './features/regulations/privacy-policy/privacy-policy.component';
import { TermsComponent } from './features/regulations/terms/terms.component';

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
        component: TermsComponent,
        data: {
          titleCode: 'TERMS',
        },
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
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
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [UserGuard],
  },
  {
    path: 'register',
    component: RegisterWrapComponent,
    pathMatch: 'full',
    canActivate: [UserGuard],
  },
  {
    path: 'account',
    component: AccountComponent,
    pathMatch: 'full',
  },
  {
    component: CompanyOffersComponent,
    path: 'company-offers',
    pathMatch: 'full',
    canActivate: [EmployerGuard],
  },
  {
    path: '',
    component: HomepageComponent,
  },
];
