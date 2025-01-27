import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IconComponent } from '../../../core/components/icon/icon.component';

@Component({
  selector: 'swip-register-step-employee-4',
  imports: [IconComponent, CommonModule],
  templateUrl: './register-step-employee-4.component.html',
})
export class RegisterStepEmployee4Component {
  @Input({ required: true }) form = {} as FormGroup;
  private destroyerRef = inject(DestroyRef);

  translations: Record<string, string> = {};

  constructor(private translate: TranslateService) {
    this.setUpTranslationsSub();
    this.loadTranslations();
  }

  private setUpTranslationsSub() {
    this.translate.onDefaultLangChange
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(() => this.loadTranslations());
  }

  private loadTranslations() {
    this.translations['PERSONAL_DATA'] = this.translate.instant('PERSONAL_DATA');
    this.translations['CONTACT_DATA'] = this.translate.instant('CONTACT_DATA');
    this.translations['FIRST_NAME'] = this.translate.instant('FIRST_NAME');
    this.translations['LAST_NAME'] = this.translate.instant('LAST_NAME');
    this.translations['CITY'] = this.translate.instant('CITY');
    this.translations['PHONE_NUMBER'] = this.translate.instant('PHONE_NUMBER');
    this.translations['EMAIL'] = this.translate.instant('EMAIL');
  }

  get personalData(): string[] {
    return (
      [
        `${this.translations['FIRST_NAME']}: ${this.name}`,
        `${this.translations['LAST_NAME']}: ${this.lastName}`,
        this.city ? `${this.translations['CITY']}: ${this.city}` : '',
      ].filter(Boolean) || []
    );
  }

  get contactData(): string[] {
    return [`${this.translations['PHONE_NUMBER']}: ${this.telephone}`, `${this.translations['EMAIL']}: ${this.email}`];
  }

  get name(): string {
    return this.form.get('firstName')?.value || '';
  }

  get lastName(): string {
    return this.form.get('lastName')?.value || '';
  }

  get city(): string {
    return this.form.get('city')?.value || '';
  }

  get telephone() {
    const tel = this.form.get('tel')?.value;
    const countryCode = this.form.get('countryCode')?.value;

    return `${countryCode} ${tel.replace(/(\d{3})(?=\d)/g, '$1-')}`;
  }

  get email() {
    return this.form.get('email')?.value || '';
  }

  get cv() {
    return this.form.get('cv')?.value.name || '';
  }
}
