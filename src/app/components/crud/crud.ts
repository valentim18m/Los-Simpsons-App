import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService, Expediente } from '../../services/firestore';
import { NotificacionesService } from '../../services/notificaciones.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
})
export class CrudComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private notificacionesService = inject(NotificacionesService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  expedientes: Expediente[] = [];

  nuevoNombre: string = '';
  nuevaOcupacion: string = '';
  nuevoNivel: string = 'Bajo';

  modoEdicion: boolean = false;
  idEdicion: string | null = null;

  // trackBy para evitar que Angular destruya y recree todo el DOM en cada cambio
  trackById(index: number, item: Expediente): string {
    return item.id || index.toString();
  }

  ngOnInit() {
    this.firestoreService.obtenerExpedientes().subscribe((data) => {
      this.ngZone.run(() => {
        this.expedientes = data;
        this.cdr.detectChanges();
      });
    });
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Archivos Secretos - Springfield', 14, 20);

    const datosTabla = this.expedientes.map((exp) => [
      exp.nombre,
      exp.ocupacion,
      exp.nivelPeligrosidad,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Nombre del Ciudadano', 'Ocupación', 'Nivel de Peligrosidad']],
      body: datosTabla,
      theme: 'grid',
      headStyles: { fillColor: [250, 204, 21], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    doc.save('reporte_springfield.pdf');
  }

  async guardarExpediente() {
    if (!this.nuevoNombre || !this.nuevaOcupacion) return;

    const nombreGuardado = this.nuevoNombre;

    try {
      if (this.modoEdicion && this.idEdicion) {
        // UPDATE
        await this.firestoreService.actualizarExpediente(this.idEdicion, {
          nombre: this.nuevoNombre,
          ocupacion: this.nuevaOcupacion,
          nivelPeligrosidad: this.nuevoNivel,
        });
      } else {
        // CREATE
        await this.firestoreService.agregarExpediente({
          nombre: this.nuevoNombre,
          ocupacion: this.nuevaOcupacion,
          nivelPeligrosidad: this.nuevoNivel,
        });
      }

      this.ngZone.run(() => {
        this.limpiarFormulario();
        this.cdr.detectChanges();
      });

      this.notificacionesService.exitoGuardado(nombreGuardado);
    } catch (error) {
      this.notificacionesService.errorSistema();
    }
  }

  editar(expediente: Expediente) {
    this.modoEdicion = true;
    this.idEdicion = expediente.id!;
    this.nuevoNombre = expediente.nombre;
    this.nuevaOcupacion = expediente.ocupacion;
    this.nuevoNivel = expediente.nivelPeligrosidad;
    this.cdr.detectChanges();
  }

  async eliminar(id: string | undefined) {
    if (!id) return;

    try {
      // DELETE
      await this.firestoreService.eliminarExpediente(id);

      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });

      this.notificacionesService.exitoEliminacion();
    } catch (error) {
      this.notificacionesService.errorSistema();
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
