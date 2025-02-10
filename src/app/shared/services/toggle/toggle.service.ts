import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IToggleElement } from './toggle.interface';

@Injectable({
  providedIn: 'root',
})
export class ToggleService {
  private toggleSubject = new BehaviorSubject<IToggleElement[]>([]);
  toggle$ = this.toggleSubject.asObservable();

  constructor() {}

  updateStepStatus(toggle: IToggleElement[]) {
    this.toggleSubject.next(toggle);
  }
}
