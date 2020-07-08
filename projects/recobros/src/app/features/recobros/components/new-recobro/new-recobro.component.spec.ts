import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRecobroComponent } from './new-recobro.component';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
const recobrosServiceStub: Partial<RecobrosService> = {};

describe('NewRecobroComponent', () => {
  let component: NewRecobroComponent;
  let fixture: ComponentFixture<NewRecobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewRecobroComponent],
      providers: [{ provide: RecobrosService, useValue: recobrosServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
