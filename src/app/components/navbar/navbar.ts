import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, HlmButtonImports, AsyncPipe, NgIf],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario$ = this.authService.usuario$;

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
