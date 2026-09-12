import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notificacionesService = inject(NotificacionesService);

  email: string = '';
  password: string = '';

  // Alternar entre modo "Ingresar" y modo "Crear Cuenta Nueva"
  esRegistro: boolean = false;

  cargando: boolean = false;
  error: string | null = null;

  enviarFormulario() {
    if (!this.email || !this.password) {
      this.error = "¡D'oh! Debes completar todos los campos para entrar a Springfield.";
      return;
    }

    this.cargando = true;
    this.error = null;

    if (this.esRegistro) {
      // REGISTRO DE USUARIO NUEVO
      this.authService
        .registrar(this.email, this.password)
        .then(() => {
          this.cargando = false;
          this.notificacionesService.exitoRegistro();
          // Esperamos 2 segundos para que se vea la alerta antes de cambiar de ruta
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        })
        .catch((err: any) => {
          this.cargando = false;
          this.manejarError(err);
        });
    } else {
      // INICIO DE SESIÓN
      this.authService
        .login(this.email, this.password)
        .then(() => {
          this.cargando = false;
          this.notificacionesService.exitoLogin();
          // Esperamos 2 segundos para que se vea la alerta antes de cambiar de ruta
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        })
        .catch((err: any) => {
          this.cargando = false;
          this.manejarError(err);
        });
    }
  }

  alternarModo() {
    this.esRegistro = !this.esRegistro;
    this.error = null;
  }

  private manejarError(err: any) {
    console.error('Error de Auth:', err);
    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/user-not-found'
    ) {
      this.error = 'Las credenciales no coinciden con ningún ciudadano del padrón.';
    } else if (err.code === 'auth/email-already-in-use') {
      this.error = '¡Ay caramba! Este correo ya está registrado en Springfield.';
    } else if (err.code === 'auth/weak-password') {
      this.error = 'La contraseña es muy débil (debe tener al menos 6 caracteres).';
    } else {
      this.error = 'Ocurrió un error en la planta nuclear. Intenta de nuevo.';
    }
    this.cdr.detectChanges();
  }
}
