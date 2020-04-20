import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecobrosListComponent } from './recobros-list.component';

describe('RecobrosListComponent', () => {
  let component: RecobrosListComponent;
  let fixture: ComponentFixture<RecobrosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecobrosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecobrosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
