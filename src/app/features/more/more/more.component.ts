import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from '../../../core/components/topbar/topbar.component';
import { StandaloneService } from '../../../core/services/standalone/standalone.service';
import { MORE_SECTIONS } from './more.data';
import { IMoreSection } from './more.interface';

@Component({
  selector: 'swip-more',
  imports: [TopbarComponent, CommonModule, MatButtonModule, TranslateModule, MatIconModule],
  templateUrl: './more.component.html',
})
export class MoreComponent {
  @ViewChild('about') targetSection!: ElementRef;
  sections: IMoreSection[] = MORE_SECTIONS;

  constructor(private standaloneService: StandaloneService) {}

  scrollToSection() {
    this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  installApp() {
    this.standaloneService.installApp();
  }
}
