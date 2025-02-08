import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWrapComponent } from './register-wrap.component';

describe('RegisterWrapComponent', () => {
  let component: RegisterWrapComponent;
  let fixture: ComponentFixture<RegisterWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
