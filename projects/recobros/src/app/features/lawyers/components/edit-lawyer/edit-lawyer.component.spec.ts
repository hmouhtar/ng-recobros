import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLawyerComponent } from './edit-lawyer.component';

describe('EditLawyerComponent', () => {
  let component: EditLawyerComponent;
  let fixture: ComponentFixture<EditLawyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLawyerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
