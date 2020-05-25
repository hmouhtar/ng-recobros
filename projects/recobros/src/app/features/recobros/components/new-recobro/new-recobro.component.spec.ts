import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecobroComponent } from './new-recobro.component';

describe('NewRecobroComponent', () => {
  let component: NewRecobroComponent;
  let fixture: ComponentFixture<NewRecobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecobroComponent ]
    })
    .compileComponents();
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
