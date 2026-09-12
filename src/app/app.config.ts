import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

// 1. Importaciones oficiales de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// 2. Tus credenciales reales
const firebaseConfig = {
  apiKey: 'AIzaSyCCxOoLUAb1P-2a2OtZ7jSMuKs_rsPJw-c',
  authDomain: 'app-los-simpsons.firebaseapp.com',
  projectId: 'app-los-simpsons',
  storageBucket: 'app-los-simpsons.firebasestorage.app',
  messagingSenderId: '889078730141',
  appId: '1:889078730141:web:68bee21d4ad23b442e7374',
  measurementId: 'G-3E5DGNG1X5',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),

    // 3. Inicializamos Firebase sin colisiones con la zona de Angular
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
