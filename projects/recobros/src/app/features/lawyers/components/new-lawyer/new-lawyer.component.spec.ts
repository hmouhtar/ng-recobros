import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLawyerComponent } from './new-lawyer.component';

describe('NewLawyerComponent', () => {
  let component: NewLawyerComponent;
  let fixture: ComponentFixture<NewLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewLawyerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
