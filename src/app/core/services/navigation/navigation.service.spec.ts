import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      config: [
        {
          path: 'home',
          data: { view: 'FOOTER' },
          children: [
            {
              path: 'about',
              data: { view: 'FOOTER' },
            },
          ],
        },
        {
          path: 'contact',
          data: { view: 'HEADER' },
        },
      ] as Route[],
    };

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should filter footer routes based on view', (done) => {
    const expectedFooterRoutes = [
      {
        path: '/home',
        data: { view: 'FOOTER' },
        children: [
          {
            path: 'about',
            data: { view: 'FOOTER' },
          },
        ],
      },
      {
        path: '/home/about',
        data: { view: 'FOOTER' },
      },
    ];

    service.footerRoutes$.subscribe((footerRoutes) => {
      expect(footerRoutes).toEqual(expectedFooterRoutes);
      done();
    });
  });

  it('should extract all routes with full paths', () => {
    const expectedRoutes = [
      {
        path: '/home',
        data: { view: 'FOOTER' },
        children: [
          {
            path: 'about',
            data: { view: 'FOOTER' },
          },
        ],
      },
    ];

    service.footerRoutes$.subscribe((footerRoutes) => {
      expect(footerRoutes).toEqual(expectedRoutes);
    });
  });

  it('should get all footer routes correctly', () => {
    const expectedFooterRoutes = [
      {
        path: '/home',
        data: { view: 'FOOTER' },
        children: [
          {
            path: 'about',
            data: { view: 'FOOTER' },
          },
        ],
      },
    ];

    service.footerRoutes$.subscribe((footerRoutes) => {
      expect(footerRoutes).toEqual(expectedFooterRoutes);
    });
  });
});
