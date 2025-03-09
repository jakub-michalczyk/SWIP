import { ELanguageCode } from '../../../shared/enums/language.enum';

export interface IUser extends IGeneralUser {
  firstName: string;
  lastName: string;
  city?: string;
  cv: ICV | null;
}

export interface ICompany extends IGeneralUser {
  city: string;
  companyName: string;
  companyImage: string;
}

export interface IGeneralUser {
  email: string;
  telephone: string;
  userType: EUserType;
  uid?: string;
  lang?: ELanguageCode;
}

export enum EUserType {
  EMPLOYER,
  EMPLOYEE,
}

export interface ICV {
  name: string;
  data: string;
}
