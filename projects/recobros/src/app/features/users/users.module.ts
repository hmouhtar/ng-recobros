import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SharedModule } from '../../shared/shared.module';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@NgModule({
  declarations: [
    UsersComponent,
    ListUsersComponent,
    NewUserComponent,
    EditUserComponent
  ],
  imports: [CommonModule, UsersRoutingModule, SharedModule]
})
export class UsersModule {}
