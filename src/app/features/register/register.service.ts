import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private verificationEmailSentSubject = new BehaviorSubject<boolean>(false);
  verificationEmailSent$ = this.verificationEmailSentSubject.asObservable();

  constructor() {}

  updateStatus(status: boolean) {
    this.verificationEmailSentSubject.next(status);
  }
}
