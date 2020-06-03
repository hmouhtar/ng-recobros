import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawyersRoutingModule } from './lawyers-routing.module';
import { LawyersComponent } from './lawyers.component';
import { ListLawyersComponent } from './components/list-lawyers/list-lawyers.component';
import { NewLawyerComponent } from './components/new-lawyer/new-lawyer.component';
import { EditLawyerComponent } from './components/edit-lawyer/edit-lawyer.component';


@NgModule({
  declarations: [LawyersComponent, ListLawyersComponent, NewLawyerComponent, EditLawyerComponent],
  imports: [
    CommonModule,
    LawyersRoutingModule
  ]
})
export class LawyersModule { }
