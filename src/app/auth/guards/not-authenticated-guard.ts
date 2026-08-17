import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/authService';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {

  //hay que ignorar el estado cheking para mostrar o no la pantalla login
  const authservice = inject(AuthService);
  const router = inject(Router);


  //firstValueFrom nos permite mandar un observable y eperar la respuesta como si fuera una promesa
  //por lo tanto hay que hacer el guard asincrono y despues el await firstValueFrom
  const isAuthenticated = await firstValueFrom(authservice.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
