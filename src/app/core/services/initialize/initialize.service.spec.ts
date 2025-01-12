import { TestBed } from '@angular/core/testing';
import { IconRegisterService } from '../icon-register/icon-register.service';
import { InitializeService } from './initialize.service';

describe('InitializeService', () => {
  let service: InitializeService;
  let iconRegisterSpy: jasmine.SpyObj<IconRegisterService>;

  beforeEach(() => {
    const iconRegisterMock = jasmine.createSpyObj('IconRegisterService', ['registerIcons']);

    TestBed.configureTestingModule({
      providers: [InitializeService, { provide: IconRegisterService, useValue: iconRegisterMock }],
    });

    service = TestBed.inject(InitializeService);
    iconRegisterSpy = TestBed.inject(IconRegisterService) as jasmine.SpyObj<IconRegisterService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call registerIcons on initializeApp', () => {
    service.initializeApp();
    expect(iconRegisterSpy.registerIcons).toHaveBeenCalled();
  });
});
