import { TestBed } from '@angular/core/testing';
import { MobileService } from './mobile.service';

describe('MobileService', () => {
  let service: MobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileService],
    });
    service = TestBed.inject(MobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly identify if the device is mobile on initialization', () => {
    const spy = spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
    } as any);
    const userAgentSpy = spyOnProperty(
      navigator,
      'userAgent',
      'get'
    ).and.returnValue('iPhone');

    expect(service['checkIfMobile']()).toBeTrue();
    expect(spy).toHaveBeenCalledWith('(max-width: 768px)');
    expect(userAgentSpy).toHaveBeenCalled();
  });

  it('should emit updated mobile status on window resize', () => {
    const spy = spyOn(service['isMobileSubject'], 'next');

    const matchMediaSpy = spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
    } as any);
    const userAgentSpy = spyOnProperty(
      navigator,
      'userAgent',
      'get'
    ).and.returnValue('Android');

    window.dispatchEvent(new Event('resize'));

    expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 768px)');
    expect(userAgentSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should correctly return an observable from isMobile$', (done) => {
    const testValue = true;

    service['isMobileSubject'].next(testValue);
    service.isMobile$.subscribe((value) => {
      expect(value).toBe(testValue);
      done();
    });
  });
});
