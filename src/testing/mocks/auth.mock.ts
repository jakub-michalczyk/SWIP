import { Auth, User } from '@angular/fire/auth';

export const mockUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  isAnonymous: false,
  providerData: [],
  phoneNumber: null,
  photoURL: null,
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn().mockResolvedValue('mocked-token'),
  getIdTokenResult: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
  reload: jest.fn(),
  refreshToken: 'mock-refresh-token',
  metadata: {
    creationTime: 'Thu, 01 Jan 1970 00:00:00 GMT',
    lastSignInTime: 'Thu, 01 Jan 1970 00:00:00 GMT',
  },
  toJSON: jest.fn(),
  providerId: 'firebase',
} as User;

export const createMockAuth = (overrides?: Partial<Auth>): Partial<Auth> => ({
  currentUser: mockUser,
  onAuthStateChanged: jest.fn((callback: (user: User | null) => void) => {
    callback(mockUser);
    return () => {};
  }),
  ...overrides,
});
