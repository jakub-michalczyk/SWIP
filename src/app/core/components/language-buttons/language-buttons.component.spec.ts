import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { createMockAuth } from '../../../../testing/mocks/auth.mock';
import { createMockFirestore } from '../../../../testing/mocks/firestore.mock';
import { createMockTranslateService } from '../../../../testing/mocks/translate-service.mock';
import { createMockUserService } from '../../../../testing/mocks/user-service.mock';
import { ELanguageCode } from '../../../shared/enums/language.enum';
import { UserService } from '../../../shared/services/user/user.service';
import { LanguageButtonsComponent } from './language-buttons.component';

describe('LanguageButtonsComponent', () => {
  let component: LanguageButtonsComponent;
  let fixture: ComponentFixture<LanguageButtonsComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    const authMock = createMockAuth();
    const firestoreMock = createMockFirestore();
    const userServiceMock = createMockUserService();
    translateService = createMockTranslateService();

    await TestBed.configureTestingModule({
      imports: [LanguageButtonsComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Firestore, useValue: firestoreMock },
        { provide: Auth, useValue: authMock },
        { provide: TranslateService, useValue: translateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageButtonsComponent);
    component = fixture.componentInstance;
    (component as any).destroyerRef = new Subject<void>();

    jest.spyOn(component as any, 'checkUserLang').mockImplementation(() => {});
  });

  it('switching language should update current language', () => {
    component.switchLanguage(ELanguageCode.PL);
    expect(translateService.defaultLang).toBe(ELanguageCode.PL);
  });
});
