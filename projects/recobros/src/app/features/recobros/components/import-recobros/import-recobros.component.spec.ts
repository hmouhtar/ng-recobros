import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';

import { ImportRecobrosComponent } from './import-recobros.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';

describe('ImportRecobrosComponent', () => {
  let component: ImportRecobrosComponent;
  let fixture: ComponentFixture<ImportRecobrosComponent>;
  let recobrosServiceSpy;
  let alertServiceSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportRecobrosComponent],
      imports: [FormsModule, ReactiveFormsModule, MatIconModule],
      providers: [
        {
          provide: RecobrosService,
          useValue: jasmine.createSpyObj(RecobrosService, ['importRecobros'])
        },
        {
          provide: AlertService,
          useValue: jasmine.createSpyObj(AlertService, [
            'emitSuccessAlert',
            'emitErrorAlert'
          ])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRecobrosComponent);
    recobrosServiceSpy = TestBed.inject(RecobrosService) as jasmine.SpyObj<
      RecobrosService
    >;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<
      AlertService
    >;
    recobrosServiceSpy.importRecobros.and.returnValue(Promise.resolve(true));
    component = fixture.componentInstance;
    spyOn(component, 'importRecobros').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('importRecobrosForm should not be valid on creation', (done) => {
    fixture.whenStable().then(() => {
      expect(component.importRecobrosForm.form.valid).toBeFalse();
      done();
    });
  });

  it('submit button should be disabled on creation', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('[type="submit"]').disabled
      ).toBeTruthy();
      done();
    });
  });

  it('submit button should be enabled if form is valid', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.importRecobrosForm.form.controls['file'].setErrors(null);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('[type="submit"]').disabled
      ).toBeFalsy();
      done();
    });
  });

  it('should call importRecobros on form submit', fakeAsync(() => {
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', { target: form.nativeElement });
    fixture.detectChanges();
    expect(component.importRecobros).toHaveBeenCalled();
  }));

  it('importRecobros should call recobrosService.importRecobros', () => {
    component.importRecobros(new Blob());
    expect(recobrosServiceSpy.importRecobros).toHaveBeenCalled();
  });

  it('submit button should be disabled on importRecobros request', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.importRecobrosForm.form.controls['file'].setErrors(null);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('[type="submit"]').disabled
      ).toBeFalsy();
      component.importRecobros(new Blob());
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('[type="submit"]').disabled
      ).toBeTruthy();
      done();
    });
  });

  it('submit button should be re-enabled after importRecobros request finishes', (done) => {
    fixture.whenStable().then(() => {
      component.importRecobrosForm.form.controls['file'].setErrors(null);
      component.importRecobros(new Blob());
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelector('[type="submit"]').disabled
        ).toBeFalsy();
        done();
      });
    });
  });

  it('should emit an alert on importRecobros success', (done) => {
    component.importRecobros(new Blob());
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(alertServiceSpy.emitSuccessAlert).toHaveBeenCalled();
      done();
    });
  });

  it('should emit an alert on importRecobros error', (done) => {
    recobrosServiceSpy.importRecobros.and.returnValue(Promise.reject(false));
    component.importRecobros(new Blob());
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(alertServiceSpy.emitErrorAlert).toHaveBeenCalled();
      done();
    });
  });
});
