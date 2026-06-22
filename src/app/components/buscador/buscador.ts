import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, Character } from '../../services/api';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './buscador.html',
})
export class BuscadorComponent implements OnInit {
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  personajes: Character[] = []; // Los 20 que se ven en la página actual

  // <-- 1. EL CAJÓN SECRETO: Aquí guardaremos a todo Springfield
  todosLosPersonajes: Character[] = [];

  personajesFiltrados: Character[] = [];
  terminoBusqueda: string = '';
  generoSeleccionado: string | null = null;

  cargando: boolean = true;
  error: string | null = null;

  // Paginación
  paginaActual: number = 1;
  totalPersonajes: number = 0;
  limite: number = 20;

  ngOnInit() {
    this.cargarPersonajes();
    this.obtenerCatalogoCompleto(); // <-- 2. Disparamos la búsqueda silenciosa
  }

  // <-- EL PARCHE DEFINITIVO: Descarga Recursiva en Background
  obtenerCatalogoCompleto(paginaSilenciosa: number = 1) {
    // Pedimos lotes de 100 para no hacer tantas peticiones de golpe
    this.apiService.getCharacters(paginaSilenciosa, 100).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];

        // Sumamos los nuevos ciudadanos que acaban de llegar al padrón total
        this.todosLosPersonajes = [...this.todosLosPersonajes, ...lista];

        // 🔥 EL DESPERTADOR: Si el usuario ya estaba buscando, actualizamos la vista al instante
        if (this.terminoBusqueda || this.generoSeleccionado !== null) {
          this.filtrarPersonajes();
          this.cdr.detectChanges();
        }

        // Si la API nos dice que hay "next" (más páginas), la función se vuelve a llamar a sí misma
        if (res.next) {
          this.obtenerCatalogoCompleto(paginaSilenciosa + 1);
        } else {
          // Cuando terminan las páginas, imprimimos este logro en consola
          console.log(
            `✅ ¡Padrón completo! Springfield tiene ${this.todosLosPersonajes.length} ciudadanos en la memoria.`,
          );
        }
      },
      error: () => console.warn('Aviso: Error bajando el catálogo en background'),
    });
  }
  cargarPersonajes() {
    this.cargando = true;
    this.error = null;

    this.apiService.getCharacters(this.paginaActual, this.limite).subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
        this.totalPersonajes = res.count ?? lista.length;
        this.personajes = lista;
        this.filtrarPersonajes();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar personajes:', err);
        this.error = 'No se pudo conectar con Springfield. Intenta de nuevo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // <-- EL CEREBRO ACTUALIZADO: Decide de qué lista tirar
  filtrarPersonajes() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    // CASO A: El buscador y los botones están limpios -> Mostramos la página 1 normal (20 tipos)
    if (!termino && !this.generoSeleccionado) {
      this.personajesFiltrados = [...this.personajes];
      return;
    }

    // CASO B: El usuario está buscando -> Tiramos del "Cajón Secreto" (todosLosPersonajes)
    // (Si por mala suerte el cajón secreto aún no terminó de descargar por internet, usa la página actual como plan B)
    const baseDeDatos =
      this.todosLosPersonajes.length > 0 ? this.todosLosPersonajes : this.personajes;

    this.personajesFiltrados = baseDeDatos.filter((p) => {
      if (!p || !p.name) return false;

      const coincideGenero =
        this.generoSeleccionado === null || p.gender === this.generoSeleccionado;
      const coincideTexto = !termino || p.name.toLowerCase().includes(termino);

      return coincideGenero && coincideTexto;
    });
  }

  seleccionarGenero(genero: string | null) {
    this.generoSeleccionado = genero;
    this.filtrarPersonajes();
  }

  get generos(): string[] {
    // Leemos los géneros disponibles desde el Cajón Secreto para que siempre salgan todos los botones
    const base = this.todosLosPersonajes.length > 0 ? this.todosLosPersonajes : this.personajes;
    const validos = base.filter((p) => p && p.gender);
    const unicos = [...new Set(validos.map((p) => p.gender))];
    return unicos.sort();
  }

  getImagen(personaje: Character): string {
    return this.apiService.getImageUrl(personaje.portrait_path);
  }

  paginaSiguiente() {
    this.paginaActual++;
    this.terminoBusqueda = '';
    this.generoSeleccionado = null;
    this.cargarPersonajes();
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.terminoBusqueda = '';
      this.generoSeleccionado = null;
      this.cargarPersonajes();
    }
  }

  get hayMasPaginas(): boolean {
    return this.paginaActual * this.limite < this.totalPersonajes;
  }
}
