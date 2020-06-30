import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LawyersComponent } from './lawyers.component';
import { ListLawyersComponent } from './components/list-lawyers/list-lawyers.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { NewLawyerComponent } from './components/new-lawyer/new-lawyer.component';
import { EditLawyerComponent } from './components/edit-lawyer/edit-lawyer.component';

const routes: Routes = [
  {
    path: '',
    component: LawyersComponent,
    children: [
      {
        path: '',
        component: ListLawyersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'new',
        component: NewLawyerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit/:id',
        component: EditLawyerComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawyersRoutingModule {}
