import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert } from '../../shared/models/alert';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();

  getAlertStream(): Observable<Alert> {
    return this.subject.asObservable();
  }

  emitSuccessAlert(message: string): void {
    this.subject.next({ type: 'success', message });
  }

  emitErrorAlert(message: string): void {
    this.subject.next({ type: 'error', message });
  }

  // clear(): void {
  //   this.subject.next();
  // }
}
