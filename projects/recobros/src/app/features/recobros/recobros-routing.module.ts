import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { RecobrosComponent } from './recobros.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { NewRecobroComponent } from './components/new-recobro/new-recobro.component';
import { ListRecobrosComponent } from './components/list-recobros/list-recobros.component';
import { EditRecobroComponent } from './components/edit-recobro/edit-recobro.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RecobrosComponent,
        children: [
          {
            path: '',
            component: ListRecobrosComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'new',
            component: NewRecobroComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:sinisterNumber/:codSinister',
            component: EditRecobroComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class RecobrosRoutingModule {}
