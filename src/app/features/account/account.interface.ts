export interface IAccountData {
  personalData: IAccountDataKey[];
  contactData: IAccountDataKey[];
}

export interface IAccountDataKey {
  title: string;
  value: string;
}
