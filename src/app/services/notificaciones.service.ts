import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  // <-- Este 'export class' convierte el archivo en un módulo válido

  exitoGuardado(nombre: string) {
    Swal.fire({
      title: '¡Excelente!',
      text: `El expediente de ${nombre} ha sido guardado.`,
      imageUrl: 'https://media.giphy.com/media/8fen5LSZcHQ5O/giphy.gif',
      imageWidth: 200,
      imageHeight: 150,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#4ade80',
      background: '#fde047',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
        confirmButton:
          'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-none uppercase',
      },
    });
  }

  errorSistema() {
    Swal.fire({
      title: "¡D'oh!",
      text: 'No pudimos conectar con Springfield. Revisa los cables.',
      imageUrl: 'https://media.giphy.com/media/xT5LMz2DWrwmbfVBK0/giphy.gif',
      imageWidth: 200,
      imageHeight: 150,
      confirmButtonText: 'Rayos',
      confirmButtonColor: '#f87171',
      background: '#fde047',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
        confirmButton:
          'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-none uppercase',
      },
    });
  }
  exitoLogin() {
    Swal.fire({
      title: '¡Acceso Concedido!',
      text: 'Bienvenido a la intranet de Springfield.',
      imageUrl: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif', // Homero festejando
      imageWidth: 200,
      imageHeight: 150,
      confirmButtonText: 'Entrar',
      confirmButtonColor: '#4ade80',
      background: '#fde047',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
        confirmButton:
          'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-none uppercase',
      },
    });
  }

  exitoRegistro() {
    Swal.fire({
      title: '¡Hola a todos!',
      text: 'Nuevo usuario registrado en la planta nuclear.',
      imageUrl: 'https://media.giphy.com/media/3o6Mb8s681i7hX1Rjq/giphy.gif', // Dr. Nick
      imageWidth: 200,
      imageHeight: 150,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#4ade80',
      background: '#fde047',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
        confirmButton:
          'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-none uppercase',
      },
    });
  }

  exitoEliminacion() {
    Swal.fire({
      title: '¡Evidencia Destruida!',
      text: 'El expediente desapareció misteriosamente...',
      imageUrl: 'https://media.giphy.com/media/jUwpNzg9IcyrK/giphy.gif', // Homero escondiéndose en los arbustos
      imageWidth: 200,
      imageHeight: 150,
      confirmButtonText: 'Hecho',
      confirmButtonColor: '#f87171',
      background: '#fde047',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
        confirmButton:
          'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-none uppercase',
      },
    });
  }
}
