export interface IUser extends IGeneralUser {
  firstName: string;
  lastName: string;
  city?: string;
  cv: string | null;
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
}

export enum EUserType {
  EMPLOYER,
  EMPLOYEE,
}
