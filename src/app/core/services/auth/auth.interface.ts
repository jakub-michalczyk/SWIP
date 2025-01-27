export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  telephone: string;
  cv: File | null;
}
