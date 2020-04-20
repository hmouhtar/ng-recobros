import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { RecobrosComponent } from './recobros.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { RecobrosNewComponent } from './components/recobros-new/recobros-new.component';
import { RecobrosListComponent } from './components/recobros-list/recobros-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RecobrosComponent,
        children: [
          {
            path: 'new',
            component: RecobrosNewComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'list',
            component: RecobrosListComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class RecobrosRoutingModule {}
