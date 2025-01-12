import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CUSTOM_ICONS } from '../../model/icon.model';

@Injectable({
  providedIn: 'root',
})
export class IconRegisterService {
  icons = CUSTOM_ICONS;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  registerIcons() {
    this.icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.route));
    });
  }
}
