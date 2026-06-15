import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-detalle-personaje',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-personaje.html',
  styleUrl: './detalle-personaje.css',
})
export class DetallePersonajeComponent implements OnInit {
  private apiService = inject(Api);
  private route = inject(ActivatedRoute);

  personaje: any = null;
  cargando: boolean = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getCharacterById(Number(id)).subscribe({
        next: (res: any) => {
          this.personaje = res.data || res;
          this.cargando = false;
        },
        error: (err: any) => {
          console.error('Error al cargar el personaje', err);
          this.cargando = false;
        },
      });
    } else {
      this.cargando = false;
    }
  }
}

