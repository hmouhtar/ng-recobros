import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { isObservable } from 'rxjs';
import { Alert } from '../../shared/models/alert';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAlertStream should return an observable', () => {
    expect(isObservable(service.getAlertStream())).toBeTrue();
  });

  it('emitSuccessAlert should emit an Alert', (done) => {
    const alert: Alert = {
      type: 'success',
      message: 'Example'
    };

    service.getAlertStream().subscribe((alert: Alert) => {
      expect(alert).toEqual(alert);
      done();
    });

    service.emitSuccessAlert(alert.message);
  });

  it('emitErrorAlert should emit an Alert', (done) => {
    const alert: Alert = {
      type: 'error',
      message: 'Example'
    };

    service.getAlertStream().subscribe((alert: Alert) => {
      expect(alert).toEqual(alert);
      done();
    });

    service.emitErrorAlert(alert.message);
  });
});
