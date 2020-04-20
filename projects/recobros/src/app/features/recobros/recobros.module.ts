import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecobrosRoutingModule } from './recobros-routing.module';
import { RecobrosComponent } from './recobros.component';
import { RecobrosListComponent } from './components/recobros-list/recobros-list.component';
import { RecobrosNewComponent } from './components/recobros-new/recobros-new.component';

@NgModule({
  declarations: [
    RecobrosComponent,
    RecobrosListComponent,
    RecobrosNewComponent,
  ],
  imports: [CommonModule, RecobrosRoutingModule],
})
export class RecobrosModule {}
