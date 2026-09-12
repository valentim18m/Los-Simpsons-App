import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// Le quitamos el ".service" al final para que coincida con el archivo auth.ts de tu carpeta
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario$.pipe(
    take(1),
    map((usuario) => {
      if (usuario) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};
