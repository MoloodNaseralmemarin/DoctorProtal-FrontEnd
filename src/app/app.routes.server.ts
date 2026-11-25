import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // The application is API driven and contains parameterized admin/detail
    // routes, so it is rendered on the client. This avoids build-time
    // prerendering of routes that require API data or route parameters.
    path: '**',
    renderMode: RenderMode.Client
  }
];
