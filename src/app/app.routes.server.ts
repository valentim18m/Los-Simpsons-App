import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Rutas protegidas: se renderizan en el servidor por request (el guard funciona)
    path: 'expedientes',
    renderMode: RenderMode.Server,
  },
  {
    // Rutas públicas: pre-renderizadas en build (rápidas y SEO-friendly)
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
