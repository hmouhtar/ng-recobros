import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecobrosComponent } from './list-recobros.component';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'projects/recobros/src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ListRecobrosComponent', () => {
  let component: ListRecobrosComponent;
  let fixture: ComponentFixture<ListRecobrosComponent>;
  let recobrosServiceSpy: jasmine.SpyObj<RecobrosService>;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListRecobrosComponent],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        {
          provide: RecobrosService,
          useValue: jasmine.createSpyObj(RecobrosService, ['getRecobrosPage'])
        },
        {
          provide: RolesService,
          useValue: jasmine.createSpyObj(RolesService, ['currentUserCan'])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    recobrosServiceSpy = TestBed.inject(RecobrosService) as jasmine.SpyObj<
      RecobrosService
    >;
    rolesServiceSpy = TestBed.inject(RolesService) as jasmine.SpyObj<
      RolesService
    >;
    fixture = TestBed.createComponent(ListRecobrosComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setTableDataSource');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a button linked to the route /recobros/new if the user can create recobros.', (done) => {
    expect(
      fixture.debugElement.query(By.css('button[routerLink="new"]'))
    ).toBeNull();
    rolesServiceSpy.currentUserCan.and.resolveTo(true);
    component.ngOnInit();
    expect(rolesServiceSpy.currentUserCan).toHaveBeenCalledWith(
      'CREATE_RECOVERY'
    );
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(
          fixture.debugElement.query(By.css('button[routerLink="new"]'))
        ).not.toBeNull();
        done();
      });
    });
  });
});
