export interface ICustomIconRegister {
  name: string;
  route: string;
}

export interface IIcon {
  value: string;
}

export const CUSTOM_ICONS: ICustomIconRegister[] = [
  {
    name: 'swip_youtube',
    route: 'icons/youtube.svg',
  },
  {
    name: 'swip_instagram',
    route: 'icons/instagram.svg',
  },
  {
    name: 'swip_facebook',
    route: 'icons/facebook.svg',
  },
  {
    name: 'swip_document',
    route: 'icons/document.svg',
  },
];
