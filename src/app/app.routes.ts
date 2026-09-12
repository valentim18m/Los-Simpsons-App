import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio';
import { BuscadorComponent } from './components/buscador/buscador';
import { DetallePersonajeComponent } from './components/detalle-personaje/detalle-personaje';
import { EpisodiosComponent } from './components/episodios/episodios';
import { LugaresComponent } from './components/lugares/lugares';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { CrudComponent } from './components/crud/crud';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Ruta de inicio (Landing Page)
  { path: 'personajes', component: BuscadorComponent }, // Buscador de personajes
  { path: 'personaje/:id', component: DetallePersonajeComponent }, // Detalle
  { path: 'episodios', component: EpisodiosComponent }, // Episodios
  { path: 'lugares', component: LugaresComponent }, // Lugares

  // 1. TUS NUEVAS RUTAS DEBEN IR ANTES DEL COMODÍN
  { path: 'login', component: LoginComponent },
  { path: 'expedientes', component: CrudComponent, canActivate: [authGuard] },

  // 2. EL COMODÍN DE SEGURIDAD (Obligatoriamente al final de todo)
  { path: '**', redirectTo: '' },
];
