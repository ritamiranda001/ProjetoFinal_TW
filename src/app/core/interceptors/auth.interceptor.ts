import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Adiciona automaticamente "Authorization: Bearer <token>" a todos os
 * pedidos feitos ao NOSSO backend (/api/...). Sem isto, cada componente
 * teria de construir headers manualmente em cada chamada HTTP.
 *
 * Os pedidos à API externa (themealdb.com) não passam por "/api",
 * por isso não levam o token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token && req.url.startsWith('/api')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
