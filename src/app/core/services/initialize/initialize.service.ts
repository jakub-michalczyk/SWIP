import { Injectable } from '@angular/core';
import { IconRegisterService } from '../icon-register/icon-register.service';

@Injectable({ providedIn: 'root' })
export class InitializeService {
  constructor(private iconRegister: IconRegisterService) {}

  initializeApp() {
    this.iconRegister.registerIcons();
  }
}
