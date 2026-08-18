import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/authService';
import { firstValueFrom } from 'rxjs';

//Comprueba si es admin para dale acceso a la ruta
export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);

  await firstValueFrom(authService.checkStatus());
  return authService.isAdmin();
};
