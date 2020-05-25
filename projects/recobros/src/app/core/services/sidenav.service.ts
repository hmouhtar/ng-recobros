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
      capability: 'exist',
      path: 'home',
      icon: 'home',
      category: 'Menu',
    },

    {
      title: 'Lista de Recobros',
      capability: 'list_recobros',
      path: 'recobros',
      icon: 'library_books',
      category: 'Gestión de Recobros',
    },
    {
      title: 'Carga de Recobros',
      capability: 'add_recobros',
      path: 'recobros/new',
      icon: 'library_add',
      category: 'Gestión de Recobros',
    },

    {
      title: 'Cuadros de Mando',
      capability: 'view_stats',
      path: 'stats',
      icon: 'insert_chart',
      category: 'Cuadros de Mando',
    },

    {
      title: 'Gestión de Usuarios',
      capability: 'manage_users',
      path: 'users',
      icon: 'account_circle',
      category: 'Administración',
    },
    {
      title: 'Configuración de Carga',
      capability: 'manage_settings',
      path: 'settings',
      icon: 'settings',
      category: 'Administración',
    },
    {
      title: 'Gestión de Abogados',
      capability: 'manage_settings',
      path: 'users?role=lawyer',
      icon: 'supervised_user_circle',
      category: 'Administración',
    },
  ];
  constructor(private rolesService: RolesService) {}

  getAllRoutes() {
    return groupBy(this.routes, 'category');
  }

  async getAvailableRoutes() {
    return this.getAllRoutes();
    let asyncFiltered = await Promise.all(
      this.routes.map(
        async (route) =>
          await this.rolesService.currentUserCan(route.capability)
      )
    );

    return groupBy(
      this.routes.filter((role, index) => asyncFiltered[index]),
      'category'
    );
  }
}
