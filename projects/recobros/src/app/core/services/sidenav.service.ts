import { Injectable } from '@angular/core';
import { RolesService } from './roles.service';
import { groupBy } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private routes = [
    {
      title: 'Home',
      capability: '',
      path: 'home',
      icon: 'home',
      category: 'Menu',
    },

    {
      title: 'Gestión de Recobros',
      capability: '',
      path: 'recobros',
      icon: 'library_books',
      category: 'Recobros',
    },
    // {
    //   title: 'Carga de Recobros',
    //   capability: 'add_recobros',
    //   path: 'recobros/new',
    //   icon: 'library_add',
    //   category: 'Gestión de Recobros',
    // },

    // {
    //   title: 'Cuadros de Mando',
    //   capability: 'view_stats',
    //   path: 'stats',
    //   icon: 'insert_chart',
    //   category: 'Cuadros de Mando',
    // },

    {
      title: 'Gestión de Usuarios',
      capability: '',
      path: 'users',
      icon: 'account_circle',
      category: 'Administración',
    },
    // {
    //   title: 'Configuración de Carga',
    //   capability: 'manage_settings',
    //   path: 'settings',
    //   icon: 'settings',
    //   category: 'Administración',
    // },
    {
      title: 'Gestión de Abogados',
      capability: '',
      path: 'lawyers',
      icon: 'supervised_user_circle',
      category: 'Administración',
    },
  ];
  constructor(private rolesService: RolesService) {}

  getAllRoutes() {
    return groupBy(this.routes, 'category');
  }

  // Returns routes accesible by the current user based on the role.
  getAccesibleRoutes(): Promise<any> {
    return Promise.all(
      this.routes.map((route) =>
        this.rolesService.currentUserCan(route.capability)
      )
    ).then((routesBool) =>
      groupBy(
        this.routes.filter((role, index) => routesBool[index]),
        'category'
      )
    );
  }
}
