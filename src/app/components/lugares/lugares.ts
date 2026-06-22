import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, Location } from '../../services/api';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lugares.html',
})
export class LugaresComponent implements OnInit {
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  lugares: Location[] = [];

  // <-- EL CAJÓN SECRETO PARA LUGARES
  todosLosLugares: Location[] = [];

  lugaresFiltrados: Location[] = [];
  terminoBusqueda: string = '';

  cargando: boolean = true;
  error: string | null = null;

  // Paginación
  paginaActual: number = 1;
  totalLugares: number = 0;
  limite: number = 20;

  ngOnInit() {
    this.cargarLugares();
    this.obtenerCatalogoCompleto(); // <-- Descarga silenciosa
  }

  // <-- DESCARGA RECURSIVA PARA LUGARES
  obtenerCatalogoCompleto(paginaSilenciosa: number = 1) {
    this.apiService.getLocations(paginaSilenciosa, 100).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];

        // Acumulamos las locaciones
        this.todosLosLugares = [...this.todosLosLugares, ...lista];

        // El despertador: si el usuario ya está buscando un lugar, actualizamos
        if (this.terminoBusqueda) {
          this.filtrarLugares();
          this.cdr.detectChanges();
        }

        // Llamada recursiva si hay más páginas
        if (res.next) {
          this.obtenerCatalogoCompleto(paginaSilenciosa + 1);
        } else {
          console.log(
            `✅ ¡Mapa completo! Springfield tiene ${this.todosLosLugares.length} locaciones en memoria.`,
          );
        }
      },
      error: () => console.warn('Aviso: Error bajando el catálogo de lugares en background'),
    });
  }

  cargarLugares() {
    this.cargando = true;
    this.error = null;

    this.apiService.getLocations(this.paginaActual, this.limite).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
        this.totalLugares = res.count ?? lista.length;
        this.lugares = lista;

        this.filtrarLugares();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar lugares:', err);
        this.error = 'No se pudo conectar con el mapa de Springfield.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrarLugares() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (!termino) {
      this.lugaresFiltrados = [...this.lugares];
      return;
    }

    const baseDeDatos = this.todosLosLugares.length > 0 ? this.todosLosLugares : this.lugares;

    this.lugaresFiltrados = baseDeDatos.filter((l) => {
      if (!l || !l.name) return false;
      return l.name.toLowerCase().includes(termino);
    });
  }

  getImagen(lugar: Location): string {
    return this.apiService.getImageUrl(lugar.image_path);
  }

  paginaSiguiente() {
    this.paginaActual++;
    this.terminoBusqueda = '';
    this.cargarLugares();
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.terminoBusqueda = '';
      this.cargarLugares();
    }
  }

  get hayMasPaginas(): boolean {
    return this.paginaActual * this.limite < this.totalLugares;
  }
}
