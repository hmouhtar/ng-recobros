import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecobrosComponent } from './list-recobros.component';

describe('ListRecobrosComponent', () => {
  let component: ListRecobrosComponent;
  let fixture: ComponentFixture<ListRecobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRecobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
