import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService, Expediente } from '../../services/firestore';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
})
export class CrudComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private notificacionesService = inject(NotificacionesService);

  expedientes: Expediente[] = [];

  nuevoNombre: string = '';
  nuevaOcupacion: string = '';
  nuevoNivel: string = 'Bajo';

  modoEdicion: boolean = false;
  idEdicion: string | null = null;

  ngOnInit() {
    this.firestoreService.obtenerExpedientes().subscribe((data) => {
      this.expedientes = data;
    });
  }

  guardarExpediente() {
    if (!this.nuevoNombre || !this.nuevaOcupacion) return;

    // Disparamos la alerta INMEDIATAMENTE al hacer clic
    this.notificacionesService.exitoGuardado(this.nuevoNombre);

    if (this.modoEdicion && this.idEdicion) {
      // UPDATE
      this.firestoreService
        .actualizarExpediente(this.idEdicion, {
          nombre: this.nuevoNombre,
          ocupacion: this.nuevaOcupacion,
          nivelPeligrosidad: this.nuevoNivel,
        })
        .then(() => this.limpiarFormulario())
        .catch(() => this.notificacionesService.errorSistema());
    } else {
      // CREATE
      this.firestoreService
        .agregarExpediente({
          nombre: this.nuevoNombre,
          ocupacion: this.nuevaOcupacion,
          nivelPeligrosidad: this.nuevoNivel,
        })
        .then(() => this.limpiarFormulario())
        .catch(() => this.notificacionesService.errorSistema());
    }
  }

  editar(expediente: Expediente) {
    this.modoEdicion = true;
    this.idEdicion = expediente.id!;
    this.nuevoNombre = expediente.nombre;
    this.nuevaOcupacion = expediente.ocupacion;
    this.nuevoNivel = expediente.nivelPeligrosidad;
  }

  eliminar(id: string | undefined) {
    if (id) {
      // Disparamos la alerta de Homero INMEDIATAMENTE
      this.notificacionesService.exitoEliminacion();

      // DELETE
      this.firestoreService
        .eliminarExpediente(id)
        .catch(() => this.notificacionesService.errorSistema());
    }
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.idEdicion = null;
    this.nuevoNombre = '';
    this.nuevaOcupacion = '';
    this.nuevoNivel = 'Bajo';
  }
}
