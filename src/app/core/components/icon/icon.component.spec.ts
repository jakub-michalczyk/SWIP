import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { IIcon } from '../../model/icon.model';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, CommonModule, MatButtonModule, IconComponent], // Dodajemy IconComponent do imports
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.icon = { value: 'home' } as IIcon;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply classNames to mat-icon', () => {
    const mockIcon: IIcon = { value: 'home' };
    component.icon = mockIcon;
    fixture.detectChanges();

    const matIcon = fixture.debugElement.query(By.css('mat-icon'));
    expect(matIcon).toBeTruthy();
    expect(matIcon.classes['!w-full']).toBeTrue();
    expect(matIcon.classes['!h-full']).toBeTrue();
    expect(matIcon.classes['!text-[length:inherit]']).toBeTrue();
  });

  it('should render button when isButton is true', () => {
    const mockIcon: IIcon = { value: 'home' };
    component.icon = mockIcon;
    component.isButton = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement).toBeTruthy();

    const matIcon = buttonElement.query(By.css('mat-icon'));
    expect(matIcon).toBeTruthy();
  });

  it('should render regular mat-icon when isButton is false', () => {
    const mockIcon: IIcon = { value: 'home' };
    component.icon = mockIcon;
    component.isButton = false;
    fixture.detectChanges();

    const matIcon = fixture.debugElement.query(By.css('mat-icon'));
    expect(matIcon).toBeTruthy();
  });
});
