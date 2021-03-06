import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecobrosComponent } from './recobros.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { NewRecobroComponent } from './components/new-recobro/new-recobro.component';
import { ListRecobrosComponent } from './components/list-recobros/list-recobros.component';
import { EditRecobroComponent } from './components/edit-recobro/edit-recobro.component';
import { ImportRecobrosComponent } from './components/import-recobros/import-recobros.component';
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
            canActivate: [AuthGuard]
          },
          {
            path: 'new',
            component: NewRecobroComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'edit/:id',
            component: EditRecobroComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'import',
            component: ImportRecobrosComponent,
            canActivate: [AuthGuard]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class RecobrosRoutingModule {}
