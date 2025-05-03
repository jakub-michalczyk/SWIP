import { Observable, of } from 'rxjs';
import { ICompany, IUser } from '../../app/core/services/auth/auth.interface';
import { UserService } from '../../app/shared/services/user/user.service';

export function createMockUserService(overrides?: Partial<UserService>): UserService {
  const mock: Partial<UserService> = {
    saveUserData: jest.fn(() => {
      return of(void 0);
    }),

    getUserData: jest.fn((): Observable<IUser | ICompany | null> => {
      return of(null);
    }),

    getData: jest.fn((): Observable<IUser | ICompany | null> => {
      return of(null);
    }),
  };

  if (overrides) {
    Object.assign(mock, overrides);
  }

  return mock as UserService;
}
