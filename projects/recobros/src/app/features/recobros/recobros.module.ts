import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecobrosRoutingModule } from './recobros-routing.module';
import { RecobrosComponent } from './recobros.component';
import { NewRecobroComponent } from './components/new-recobro/new-recobro.component';
import { ListRecobrosComponent } from './components/list-recobros/list-recobros.component';
import { SharedModule } from '../../shared/shared.module';
import { EditRecobroComponent } from './components/edit-recobro/edit-recobro.component';

@NgModule({
  declarations: [RecobrosComponent, NewRecobroComponent, ListRecobrosComponent, EditRecobroComponent],
  imports: [CommonModule, RecobrosRoutingModule, SharedModule],
})
export class RecobrosModule {}
