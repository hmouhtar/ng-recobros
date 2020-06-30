import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecobroComponent } from './edit-recobro.component';

describe('EditRecobroComponent', () => {
  let component: EditRecobroComponent;
  let fixture: ComponentFixture<EditRecobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRecobroComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
