import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor() {}

  currentUserCan(capability: string) {
    return true;
  }
}
