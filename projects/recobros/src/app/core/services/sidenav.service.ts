import { Injectable } from '@angular/core';
import { RolesService } from './roles.service';
import { groupBy } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private routes = [
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

    {
      title: 'Gestión de Abogados',
      capability: 'DISPLAY_LAWYER_LIST',
      path: 'lawyers',
      icon: 'supervised_user_circle',
      category: 'Administración'
    }
  ];
  constructor(private rolesService: RolesService) {}

  getAllRoutes() {
    return groupBy(this.routes, 'category');
  }

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
