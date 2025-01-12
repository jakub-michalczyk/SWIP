import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ELanguageCode } from '../../../shared/enums/language.enum';
import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let translateServiceMock: jasmine.SpyObj<TranslateService>;
  let onDefaultLangChange$: Subject<{ lang: string }>;

  beforeEach(() => {
    onDefaultLangChange$ = new Subject();

    translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);

    translateServiceMock.currentLang = ELanguageCode.EN;
    translateServiceMock.defaultLang = ELanguageCode.EN;

    Object.defineProperty(translateServiceMock, 'onDefaultLangChange', {
      get: () => onDefaultLangChange$.asObservable(),
    });

    TestBed.configureTestingModule({
      imports: [MatButtonModule],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize lang to currentLang or defaultLang on setup', () => {
    translateServiceMock.currentLang = ELanguageCode.PL;
    component.setUpLang();
    expect(component.lang).toBe(ELanguageCode.PL);

    translateServiceMock.currentLang = null as any;
    translateServiceMock.defaultLang = ELanguageCode.EN;
    component.setUpLang();
    expect(component.lang).toBe(ELanguageCode.EN);
  });

  it('should update lang when onDefaultLangChange emits a new value', () => {
    component.setUpLang();

    onDefaultLangChange$.next({ lang: ELanguageCode.PL });
    expect(component.lang).toBe(ELanguageCode.PL);

    onDefaultLangChange$.next({ lang: ELanguageCode.EN });
    expect(component.lang).toBe(ELanguageCode.EN);
  });

  it('should call TranslateService setDefaultLang when switchLanguage is invoked', () => {
    component.switchLanguage(ELanguageCode.PL);
    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith(ELanguageCode.PL);

    component.switchLanguage(ELanguageCode.EN);
    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith(ELanguageCode.EN);
  });
});
