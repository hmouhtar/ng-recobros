import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecobrosNewComponent } from './recobros-new.component';

describe('RecobrosNewComponent', () => {
  let component: RecobrosNewComponent;
  let fixture: ComponentFixture<RecobrosNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecobrosNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecobrosNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
