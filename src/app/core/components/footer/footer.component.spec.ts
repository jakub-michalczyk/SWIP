import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MobileService } from '../../../shared/services/mobile/mobile.service';
import { FooterComponent } from './footer.component';
import { FOOTER_DATA } from './footer.data';
import { IFooterLink } from './footer.interface';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isMobileSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [FooterComponent, MatIconModule, RouterTestingModule],
      providers: [
        {
          provide: MobileService,
          useValue: {
            isMobile$: isMobileSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns with FOOTER_DATA', () => {
    expect(component.columns).toEqual(FOOTER_DATA);
  });

  it('should set current year correctly', () => {
    const currentYear = new Date().getFullYear();
    expect(component.year).toBe(currentYear);
  });

  describe('when mobile state changes', () => {
    it('should update columns to mobile layout when isMobile is true', () => {
      isMobileSubject.next(true);
      fixture.detectChanges();

      const textLinks: IFooterLink[] = FOOTER_DATA.flatMap((column) => column.data.filter((link) => !link.isIcon));
      const icons: IFooterLink[] = FOOTER_DATA.flatMap((column) => column.data.filter((link) => link.isIcon));

      const expectedMobileColumns = [
        { heading: '', data: textLinks },
        { heading: '', data: icons },
      ];

      expect(component.columns).toEqual(expectedMobileColumns);
    });

    it('should revert columns to original layout when isMobile is false', () => {
      isMobileSubject.next(false);
      fixture.detectChanges();

      expect(component.columns).toEqual(FOOTER_DATA);
    });
  });

  it('should call setUpMobileServiceSub in the constructor', () => {
    const spy = spyOn(FooterComponent.prototype, 'setUpMobileServiceSub');
    const testFixture = TestBed.createComponent(FooterComponent);
    testFixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should correctly set the isMobile value from the MobileService observable', () => {
    isMobileSubject.next(true);
    fixture.detectChanges();
    expect(component.isMobile).toBeTrue();

    isMobileSubject.next(false);
    fixture.detectChanges();
    expect(component.isMobile).toBeFalse();
  });
});
