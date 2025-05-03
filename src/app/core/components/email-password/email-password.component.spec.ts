import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmailPasswordComponent } from './email-password.component';

describe('EmailPasswordComponent', () => {
  let component: EmailPasswordComponent;
  let fixture: ComponentFixture<EmailPasswordComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailPasswordComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailPasswordComponent);
    component = fixture.componentInstance;
    form = new FormBuilder().group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])(?=(.*[A-Za-z]){4,})[A-Za-z\d@$!%*?&]{7,}$/
          ),
        ],
      ],
    });
    component.form = form;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle hide value when togglePasswordVisibility is called', () => {
    expect(component.hide()).toBe(true);

    component.togglePasswordVisibility(new MouseEvent('click'));
    expect(component.hide()).toBe(false);
  });
});
