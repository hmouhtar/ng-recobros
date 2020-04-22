import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { User } from './shared/models/user';
import { Config } from '../constants';
@Component({ selector: 'alvea-root', templateUrl: './app.component.html' })
export class AppComponent {
  currentUser: User | null;

  constructor() {}
}
