import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'recobros',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/recobros/recobros.module').then(
        (m) => m.RecobrosModule
      ),
  },

  {
    path: 'stats',
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.module').then((m) => m.UsersModule),
  },
  { path: 'lawyers', loadChildren: () => import('./features/lawyers/lawyers.module').then(m => m.LawyersModule) },

  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
