import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';

import { EditRecobroComponent } from './edit-recobro.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from 'projects/recobros/src/app/core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { SharedModule } from 'projects/recobros/src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sample, Dictionary } from 'lodash';

describe('EditRecobroComponent', () => {
  const sampleRecobroID = '123';
  const sampleEditRecobroFields: Field<Recobro>[] = [
    {
      type: 'number',
      label: 'Section 1 Field',
      name: 'codSinister',
      section: 'recoverySectionOne',
      context: 'edit'
    },
    {
      type: 'number',
      label: 'Section 2 Field',
      name: 'codSinister',
      section: 'recoverySectionTwo',
      context: 'edit'
    },
    {
      type: 'text',
      label: 'Section 1 Field',
      name: 'codSinister',
      section: 'recoverySectionOne',
      context: 'edit'
    },
    {
      type: 'text',
      label: 'Section 3 Field',
      name: 'codSinister',
      section: 'recoverySectionThree',
      context: 'edit'
    }
  ];
  let component: EditRecobroComponent;
  let fixture: ComponentFixture<EditRecobroComponent>;
  let recobrosServiceSpy: jasmine.SpyObj<RecobrosService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let fieldServiceSpy: jasmine.SpyObj<FieldService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRecobroComponent],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        {
          provide: FieldService,
          useValue: jasmine.createSpyObj(FieldService, [
            'getRecobroFields',
            'groupFieldsBySection'
          ])
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => sampleRecobroID
              }
            }
          }
        },
        {
          provide: RecobrosService,
          useValue: jasmine.createSpyObj(RecobrosService, [
            'getRecobro',
            'editRecobro'
          ])
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
    recobrosServiceSpy = TestBed.inject(RecobrosService) as jasmine.SpyObj<
      RecobrosService
    >;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<
      AlertService
    >;
    fieldServiceSpy = TestBed.inject(FieldService) as jasmine.SpyObj<
      FieldService
    >;

    fixture = TestBed.createComponent(EditRecobroComponent);
    component = fixture.componentInstance;
    spyOn(component, 'reloadPage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set the recobroID', () => {
    spyOn(component, 'getRecobroID').and.returnValue(sampleRecobroID);
    component.ngOnInit();
    expect(component.getRecobroID).toHaveBeenCalled();
    expect(component.recobroID).toEqual(sampleRecobroID);
  });

  it('ngAfterViewInit should set recobro, fields and form subscription', (done) => {
    const sampleRecobro = {} as Recobro;
    const sampleRecobroFields = [] as Field<Recobro>[];
    const sampleRecobroFieldsKeyedBySection = {} as Dictionary<
      Field<Recobro>[]
    >;
    const sampleEditRecobroFormSubscription = new Subscription();
    recobrosServiceSpy.getRecobro.and.resolveTo(sampleRecobro);
    fieldServiceSpy.getRecobroFields.and.resolveTo(sampleRecobroFields);
    fieldServiceSpy.groupFieldsBySection.and.returnValue(
      sampleRecobroFieldsKeyedBySection
    );
    spyOn(component, 'subscribeToFormValueChanges').and.returnValue(
      sampleEditRecobroFormSubscription
    );

    component.ngAfterViewInit();

    fixture.whenStable().then(() => {
      fixture.whenStable().then(() => {
        fixture.whenStable().then(() => {
          expect(component.recobro).toEqual(sampleRecobro);
          expect(component.allFields).toEqual(
            sampleRecobroFieldsKeyedBySection
          );
          expect(component.formChangesSubscription).toEqual(
            sampleEditRecobroFormSubscription
          );

          done();
        });
      });
    });
  });

  it(
    'setRecoveryCloseFieldsAsOptional should set all the fields from the close section as optional'
  );
  it(
    'setRecoveryCloseFieldsAsRequired should set all the fields from the close section as required'
  );

  it(
    'isRecoverySituationFinished should return true if the recoverySituation field value is "FINISHED" '
  );

  it(
    'editRecobroForm valueChanges subscription should either call setRecoveryCloseFieldsAsOptional or setRecoveryCloseFieldsARequired when the recoverySituation field value changes'
  );

  it('editRecobro should show a confirm dialog if recoverySituation field value is "FINISHED"', () => {
    spyOn(window, 'confirm');
    spyOn(component, 'isRecoverySituationFinished').and.returnValue(true);
    component.editRecobro();
    expect(window.confirm).toHaveBeenCalled();
  });

  it('editRecobro should not show a confirm dialog if recoverySituation field value is not "FINISHED"', (done) => {
    spyOn(window, 'confirm');
    spyOn(component, 'isRecoverySituationFinished').and.returnValue(false);
    recobrosServiceSpy.editRecobro.and.resolveTo(true);
    component.editRecobroForm = new NgForm([], []);
    component.editRecobro();
    expect(window.confirm).not.toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.whenStable().then(() => {
        fixture.whenStable().then(() => {
          done();
        });
      });
    });
  });

  it('editRecobro should NOT proceed if the confirm dialog is rejected"', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component, 'isRecoverySituationFinished').and.returnValue(true);
    component.editRecobro();
    expect(recobrosServiceSpy.editRecobro).not.toHaveBeenCalled();
  });

  it('editRecobro should proceed if the confirm dialog is accepted"', (done) => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'isRecoverySituationFinished').and.returnValue(true);
    recobrosServiceSpy.editRecobro.and.resolveTo(true);
    component.editRecobroForm = new NgForm([], []);
    component.editRecobro();
    expect(recobrosServiceSpy.editRecobro).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.whenStable().then(() => {
        fixture.whenStable().then(() => {
          done();
        });
      });
    });
  });
  // it('submit button should be disabled if form is not valid', (done) => {
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     component.editRecobroForm.form.setErrors({ sampleError: true });
  //     fixture.detectChanges();
  //     expect(
  //       fixture.nativeElement.querySelector('[type="submit"]').disabled
  //     ).toBeTrue();
  //     done();
  //   });
  // });

  // it('submit button should be enabled if form is valid', (done) => {
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     if (!component.editRecobroForm.form.valid) {
  //       component.editRecobroForm.form.setErrors(null);
  //     }
  //     fixture.detectChanges();
  //     expect(
  //       fixture.nativeElement.querySelector('[type="submit"]').disabled
  //     ).toBeFalse();
  //     done();
  //   });
  // });
});
