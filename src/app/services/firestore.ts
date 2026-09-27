import { Injectable } from '@angular/core';
// Importamos TODO estrictamente desde el núcleo puro de Firebase
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Expediente {
  id?: string;
  nombre: string;
  ocupacion: string;
  nivelPeligrosidad: string;
}

// Tus credenciales directas para aislar el servicio
const firebaseConfig = {
  apiKey: 'AIzaSyCCxOoLUAb1P-2a2OtZ7jSMuKs_rsPJw-c',
  authDomain: 'app-los-simpsons.firebaseapp.com',
  projectId: 'app-los-simpsons',
  storageBucket: 'app-los-simpsons.firebasestorage.app',
  messagingSenderId: '889078730141',
  appId: '1:889078730141:web:68bee21d4ad23b442e7374',
  measurementId: 'G-3E5DGNG1X5',
};

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private db: any;

  constructor() {
    // Reutilizamos la app ya inicializada por app.config.ts (si existe)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  agregarExpediente(expediente: Expediente) {
    const expedientesRef = collection(this.db, 'expedientes');
    return addDoc(expedientesRef, expediente);
  }

  obtenerExpedientes(): Observable<Expediente[]> {
    return new Observable((observer) => {
      const expedientesRef = collection(this.db, 'expedientes');
      const unsubscribe = onSnapshot(expedientesRef, (snapshot) => {
        const expedientes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expediente[];
        observer.next(expedientes);
      });
      return () => unsubscribe();
    });
  }

  actualizarExpediente(id: string, datosNuevos: Partial<Expediente>) {
    const docRef = doc(this.db, `expedientes/${id}`);
    return updateDoc(docRef, datosNuevos);
  }

  eliminarExpediente(id: string) {
    const docRef = doc(this.db, `expedientes/${id}`);
    return deleteDoc(docRef);
  }
}
