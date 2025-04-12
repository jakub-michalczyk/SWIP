import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // wersja starsza
    removeListener: jest.fn(), // wersja starsza
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

setupZoneTestEnv();
