import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecobrosComponent } from './recobros.component';

describe('RecobrosComponent', () => {
  let component: RecobrosComponent;
  let fixture: ComponentFixture<RecobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
