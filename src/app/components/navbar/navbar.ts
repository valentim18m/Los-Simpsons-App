import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, HlmButtonImports],
  templateUrl: './navbar.html',
})
export class NavbarComponent {}
