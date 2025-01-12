import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUSTOM_ICONS } from '../../model/icon.model';
import { IconRegisterService } from './icon-register.service';

describe('IconRegisterService', () => {
  let service: IconRegisterService;
  let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const matIconRegistrySpyObj = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
    const domSanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    TestBed.configureTestingModule({
      providers: [
        IconRegisterService,
        { provide: MatIconRegistry, useValue: matIconRegistrySpyObj },
        { provide: DomSanitizer, useValue: domSanitizerSpyObj },
      ],
    });
    service = TestBed.inject(IconRegisterService);
    matIconRegistrySpy = TestBed.inject(MatIconRegistry) as jasmine.SpyObj<MatIconRegistry>;
    domSanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register icons', () => {
    service.icons = CUSTOM_ICONS;
    service.registerIcons();

    expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(service.icons.length);
    service.icons.forEach((icon) => {
      expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledWith(
        icon.name,
        domSanitizerSpy.bypassSecurityTrustResourceUrl(icon.route)
      );
    });
  });
});
