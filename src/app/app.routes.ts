import { Routes } from '@angular/router';
import { BuscadorComponent } from './components/buscador/buscador';
import { DetallePersonajeComponent } from './components/detalle-personaje/detalle-personaje';

export const routes: Routes = [
  { path: '', component: BuscadorComponent }, // Ruta principal (Buscador)
  { path: 'personaje/:id', component: DetallePersonajeComponent }, // Ruta de detalle con parámetro ID
  { path: '**', redirectTo: '' }, // Redirección por si ingresan una ruta inexistente
];
