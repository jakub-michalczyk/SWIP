export interface IFooterColumn {
  heading: string;
  data: IFooterLink[];
}

export interface IFooterLink {
  value: string;
  link: string;
  isIcon: boolean;
}
