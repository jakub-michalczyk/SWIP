export interface IFooterColumn {
  headingCode: string;
  data: IFooterLink[];
}

export interface IFooterLink {
  value: string;
  link: string;
  isIcon: boolean;
}
