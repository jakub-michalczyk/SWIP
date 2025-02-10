import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStepEmployer3Component } from './register-step-employer-3.component';

describe('RegisterStepEmployer3Component', () => {
  let component: RegisterStepEmployer3Component;
  let fixture: ComponentFixture<RegisterStepEmployer3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStepEmployer3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterStepEmployer3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
