import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStepEmployee4Component } from './register-step-employee-4.component';

describe('RegisterStepEmployee4Component', () => {
  let component: RegisterStepEmployee4Component;
  let fixture: ComponentFixture<RegisterStepEmployee4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStepEmployee4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStepEmployee4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
