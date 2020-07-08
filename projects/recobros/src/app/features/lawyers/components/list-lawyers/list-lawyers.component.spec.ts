import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLawyersComponent } from './list-lawyers.component';
import { LawyersService } from 'projects/recobros/src/app/core/services/lawyers.service';

describe('ListLawyersComponent', () => {
  let component: ListLawyersComponent;
  let fixture: ComponentFixture<ListLawyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListLawyersComponent],
      providers: [LawyersService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLawyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
