import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStepEmployee2Component } from './register-step-employee-2.component';

describe('RegisterStepEmployee2Component', () => {
  let component: RegisterStepEmployee2Component;
  let fixture: ComponentFixture<RegisterStepEmployee2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStepEmployee2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStepEmployee2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
