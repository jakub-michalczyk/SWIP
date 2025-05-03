import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { createMockAuth } from '../../../../testing/mocks/auth.mock';
import { FooterComponent } from './footer.component';
import { FOOTER_DATA } from './footer.data';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    const mockAuth = createMockAuth();

    await TestBed.configureTestingModule({
      imports: [FooterComponent, TranslateModule.forRoot(), RouterModule.forRoot([]), MatIconTestingModule],
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: mockAuth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update columns correctly based on navData', () => {
    component.columns = [];

    const navData: Route[] = [
      {
        path: 'home',
        data: { headingCode: 'homeHeading' },
        children: [
          { path: 'about', data: { name: 'About' } },
          { path: 'contact', data: { name: 'Contact' } },
        ],
      },
      {
        path: 'services',
        data: { headingCode: 'servicesHeading' },
        children: [],
      },
    ];

    component['getMenuData'](navData);

    expect(component.columns).toEqual([
      {
        headingCode: 'homeHeading',
        data: [
          { name: 'About', path: 'home/about' },
          { name: 'Contact', path: 'home/contact' },
        ],
      },
      FOOTER_DATA,
      {
        headingCode: 'servicesHeading',
        data: [{ headingCode: 'servicesHeading', path: '/services' }],
      },
    ]);
  });
});
