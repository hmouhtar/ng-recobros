import { TestBed } from '@angular/core/testing';
import { SidenavService } from './sidenav.service';
import { Route } from '../../shared/models/route';
import { RolesService } from './roles.service';
const routes: Route[] = [
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
describe('SidenavService', () => {
  let masterService: SidenavService;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('RolesService', ['currentUserCan']);

    TestBed.configureTestingModule({
      providers: [{ provide: RolesService, useValue: spy }]
    });

    masterService = TestBed.inject(SidenavService);
    rolesServiceSpy = TestBed.inject(RolesService) as jasmine.SpyObj<
      RolesService
    >;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  it('should only return routes accesible by current user', async () => {
    spyOn(masterService, 'getAllRoutes').and.returnValue(routes);

    rolesServiceSpy.currentUserCan.and.returnValue(Promise.resolve(false));
    await expectAsync(
      masterService.getAccesibleRoutesByCurrentUser()
    ).toBeResolvedTo([]);

    rolesServiceSpy.currentUserCan.and.returnValue(Promise.resolve(true));
    await expectAsync(
      masterService.getAccesibleRoutesByCurrentUser()
    ).toBeResolvedTo(routes);
  });
});
