import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Observable para saber el estado en tiempo real (si el usuario está logueado o no)
  usuario$: Observable<User | null> = user(this.auth);

  // Registrar un nuevo ciudadano de Springfield
  registrar(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  // Iniciar sesión en la plataforma
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // Salir (Cerrar sesión)
  logout() {
    return signOut(this.auth);
  }
}
