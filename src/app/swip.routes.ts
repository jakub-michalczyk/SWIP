import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { EmployerGuard } from './core/guards/employer.guard';
import { HomepageGuard } from './core/guards/homepage.guard';
import { JobBoardGuard } from './core/guards/job-board.guard';
import { NotVerifiedGuard } from './core/guards/not-verified.guard';
import { UserGuard } from './core/guards/user.guard';
import { AccountComponent } from './features/account/account/account.component';
import { CompanyOffersComponent } from './features/company/company-offers/company-offers.component';
import { NewOfferComponent } from './features/company/new-offer/new-offer.component';
import { HomepageComponent } from './features/home/homepage/homepage.component';
import { JobsWrapComponent } from './features/jobs/jobs-wrap/jobs-wrap.component';
import { LoginComponent } from './features/login/login/login.component';
import { NotVerifiedWrapComponent } from './features/not-verified/not-verified-wrap/not-verified-wrap.component';
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
    canActivate: [AuthGuard],
  },
  {
    component: CompanyOffersComponent,
    path: 'company-offers',
    pathMatch: 'full',
    canActivate: [EmployerGuard, AuthGuard],
  },
  {
    component: NotVerifiedWrapComponent,
    path: 'not-verified',
    pathMatch: 'full',
    canActivate: [NotVerifiedGuard],
  },
  {
    path: 'jobs',
    component: JobsWrapComponent,
    canActivate: [AuthGuard, JobBoardGuard],
  },
  {
    path: 'new-offer',
    component: NewOfferComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [HomepageGuard],
  },
];
