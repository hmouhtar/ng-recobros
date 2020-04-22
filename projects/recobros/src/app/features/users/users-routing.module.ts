import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ListUsersComponent } from './components/list-users/list-users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        component: ListUsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'new',
        component: NewUserComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
