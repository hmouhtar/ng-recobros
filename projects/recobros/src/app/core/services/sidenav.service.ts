import { Injectable } from '@angular/core';
import { RolesService } from './roles.service';
import { groupBy, Dictionary } from 'lodash';
import { Route } from '../../shared/models/route';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private routes: Route[] = [
    {
      title: 'Home',
      capability: '',
      path: 'home',
      icon: 'home',
      category: 'Menu'
    },

    {
      title: 'Gestión de Recobros',
      capability: '',
      path: 'recobros',
      icon: 'library_books',
      category: 'Recobros'
    },
    {
      title: 'Carga de Recobros',
      capability: 'CREATE_RECOVERY',
      path: 'recobros/import',
      icon: 'library_add',
      category: 'Recobros'
    },
    {
      title: 'Cuadros de Mando',
      capability: 'CREATE_RECOVERY',
      path: 'stats',
      icon: 'insert_chart',
      category: 'Cuadros de Mando'
    },

    {
      title: 'Gestión de Usuarios',
      capability: 'DISPLAY_USERS',
      path: 'users',
      icon: 'account_circle',
      category: 'Administración'
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
      capability: 'DISPLAY_LAWYER_LIST',
      path: 'lawyers',
      icon: 'supervised_user_circle',
      category: 'Administración'
    }
  ];
  constructor(private rolesService: RolesService) {}

  getAllRoutes(): Route[] {
    return this.routes;
  }

  getAccesibleRoutesByCurrentUser(): Promise<Route[]> {
    return Promise.all(
      this.getAllRoutes().map((route) =>
        this.rolesService.currentUserCan(route.capability)
      )
    ).then((routesBool: Array<boolean>) => {
      return this.getAllRoutes().filter((route, index) => routesBool[index]);
    });
  }
}
