import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStepEmployee3Component } from './register-step-employee-3.component';

describe('RegisterStepEmployee3Component', () => {
  let component: RegisterStepEmployee3Component;
  let fixture: ComponentFixture<RegisterStepEmployee3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStepEmployee3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStepEmployee3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
