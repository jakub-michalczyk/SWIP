import { Routes } from '@angular/router';
import { EmployerGuard } from './core/guards/employer.guard';
import { JobBoardGuard } from './core/guards/job-board.guard';
import { UserGuard } from './core/guards/user.guard';
import { AccountComponent } from './features/account/account/account.component';
import { CompanyOffersComponent } from './features/company/company-offers/company-offers.component';
import { HomepageComponent } from './features/home/homepage/homepage.component';
import { JobsWrapComponent } from './features/jobs/jobs-wrap/jobs-wrap.component';
import { LoginComponent } from './features/login/login/login.component';
import { NotVerifiedWrapComponent } from './features/not-verified/not-verified-wrap/not-verified-wrap.component';
import { RegisterWrapComponent } from './features/register/register-wrap/register-wrap.component';
import { PrivacyPolicyComponent } from './features/regulations/privacy-policy/privacy-policy.component';
import { TermsComponent } from './features/regulations/terms/terms.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomepageGuard } from './shared/guards/homepage.guard';
import { NotVerifiedGuard } from './shared/guards/not-verified.guard';

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
    path: '',
    component: HomepageComponent,
    canActivate: [HomepageGuard],
  },
];
