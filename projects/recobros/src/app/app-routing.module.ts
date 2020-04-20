import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes = {
  root: {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

  home: {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  recobros: {
    path: 'recobros',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/recobros/recobros.module').then(
        (m) => m.RecobrosModule
      ),
  },

  stats: {
    path: 'stats',
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  users: {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },

  login: {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },

  all: {
    path: '**',
    redirectTo: 'home',
  },
};

@NgModule({
  imports: [RouterModule.forRoot(Object.values(routes))],
  exports: [RouterModule],
})
export class AppRoutingModule {}
