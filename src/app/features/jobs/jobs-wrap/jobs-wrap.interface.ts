import { FieldValue } from 'firebase/firestore';
import { IFile } from '../../../core/services/auth/auth.interface';

export interface IJobOffer extends IJobOfferDTO, ICompanyAdditionalData {
  id: string;
}

export interface ICompanyOffers {
  totalCount: number;
  offers: IJobOffer[];
}

export interface IJobOfferDTO {
  title: string;
  description: string;
  tags: string[];
  city: string;
  companyId: string;
  contractType: EContractType;
  salaryFrom: number;
  salaryTo?: number;
  workMode: EWorkMode;
  employmentType: EEmploymentType;
  id: string;
  createdAt: FieldValue;
}

export interface ICompanyAdditionalData {
  companyImage: string;
  companyName: string;
}

export enum EApplicationStatus {
  REJECTED = 'rejected',
  APPLIED = 'applied',
}

export interface IJobApplication {
  status: EApplicationStatus;
  appliedAt: string;
  jobTitle: string;
  companyName: string;
  companyId: string;
  jobId: string;
  userId: string;
  cv: IFile;
}

export enum EDirection {
  LEFT = 'left',
  RIGHT = 'right',
  DOWN = 'down',
  UP = 'up',
}

export enum EContractType {
  UOP = 'UoP',
  B2B = 'B2B',
  UOZ = 'UoZ',
  UOD = 'UoD',
  INTERN = 'Intern',
}

export enum EWorkMode {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'On-site',
}

export enum EEmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
}
