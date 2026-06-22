import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, Episode } from '../../services/api';

@Component({
  selector: 'app-episodios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episodios.html',
  styleUrl: './episodios.css',
})
export class EpisodiosComponent implements OnInit {
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  episodios: Episode[] = [];

  // <-- EL CAJÓN SECRETO PARA EPISODIOS
  todosLosEpisodios: Episode[] = [];

  episodiosFiltrados: Episode[] = [];
  temporadaSeleccionada: number | null = null;
  terminoBusqueda: string = '';

  cargando: boolean = true;
  error: string | null = null;

  // Paginación
  paginaActual: number = 1;
  totalEpisodios: number = 0;
  limite: number = 20;

  ngOnInit() {
    this.cargarEpisodios();
    this.obtenerCatalogoCompleto(); // <-- Descarga silenciosa
  }

  // <-- DESCARGA RECURSIVA PARA EPISODIOS
  obtenerCatalogoCompleto(paginaSilenciosa: number = 1) {
    this.apiService.getEpisodes(paginaSilenciosa, 100).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];

        // Acumulamos los episodios
        this.todosLosEpisodios = [...this.todosLosEpisodios, ...lista];

        // El despertador: si el usuario ya escribió algo o eligió temporada, filtramos
        if (this.terminoBusqueda || this.temporadaSeleccionada !== null) {
          this.filtrarEpisodios();
          this.cdr.detectChanges();
        }

        // Llamada recursiva si hay más páginas
        if (res.next) {
          this.obtenerCatalogoCompleto(paginaSilenciosa + 1);
        } else {
          console.log(
            `✅ ¡Guía completa! Springfield tiene ${this.todosLosEpisodios.length} episodios en memoria.`,
          );
        }
      },
      error: () => console.warn('Aviso: Error bajando el catálogo de episodios en background'),
    });
  }

  cargarEpisodios() {
    this.cargando = true;
    this.error = null;

    this.apiService.getEpisodes(this.paginaActual, this.limite).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
        this.totalEpisodios = res.count ?? lista.length;
        this.episodios = lista;

        this.filtrarEpisodios();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar episodios:', err);
        this.error = 'No se pudo conectar con la guía de episodios.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrarEpisodios() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    // Si no hay búsqueda ni filtro, mostramos la paginación normal
    if (!termino && this.temporadaSeleccionada === null) {
      this.episodiosFiltrados = [...this.episodios];
      return;
    }

    // Si están buscando, tiramos del catálogo global
    const baseDeDatos = this.todosLosEpisodios.length > 0 ? this.todosLosEpisodios : this.episodios;

    this.episodiosFiltrados = baseDeDatos.filter((e) => {
      if (!e || typeof e.season === 'undefined') return false;

      const coincideTemporada =
        this.temporadaSeleccionada === null || e.season === this.temporadaSeleccionada;
      const coincideTexto = !termino || (e.name && e.name.toLowerCase().includes(termino));

      return coincideTemporada && coincideTexto;
    });
  }

  seleccionarTemporada(temporada: number | null) {
    this.temporadaSeleccionada = temporada;
    this.filtrarEpisodios();
  }

  getImagen(ep: Episode): string {
    return this.apiService.getImageUrl(ep.image_path);
  }

  get temporadas(): number[] {
    // Leemos del cajón secreto para asegurar que todas las temporadas existan en los botones
    const base = this.todosLosEpisodios.length > 0 ? this.todosLosEpisodios : this.episodios;
    const episodiosValidos = base.filter((e) => e && typeof e.season !== 'undefined');
    const unicos = [...new Set(episodiosValidos.map((e) => e.season))];
    return unicos.sort((a, b) => a - b);
  }

  paginaSiguiente() {
    this.paginaActual++;
    this.terminoBusqueda = '';
    this.temporadaSeleccionada = null;
    this.cargarEpisodios();
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.terminoBusqueda = '';
      this.temporadaSeleccionada = null;
      this.cargarEpisodios();
    }
  }

  get hayMasPaginas(): boolean {
    return this.paginaActual * this.limite < this.totalEpisodios;
  }
}
