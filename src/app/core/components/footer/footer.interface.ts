export interface IFooterColumn {
  headingCode: string;
  data: IFooterLink[];
}

export interface IFooterLink {
  path: string;
  translationCode: string;
  isIcon?: boolean;
}
