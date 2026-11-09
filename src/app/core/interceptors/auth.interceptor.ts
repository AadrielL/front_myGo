import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. SE FOR LOGIN OU REGISTER OU ROTAS PÚBLICAS, PASSA DIRETO (SEM HEADERS EXTRAS)
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register') || request.url.includes('/auth/parceiros-destaque')) {
      return next.handle(request);
    }

    // 2. BUSCA OS DADOS PARA AS DEMAIS REQUISIÇÕES (8081, 8082)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const tenantPublico = localStorage.getItem('tenant_eletricista');

    let headersConfig: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // 3. SE O TOKEN EXISTIR (Eletricista Logado)
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    // 4. ADICIONA OS HEADERS QUE A CALCULADORA (8081) ESPERA
    if (role) {
      headersConfig['X-User-Role'] = role;
    } else {
      headersConfig['X-User-Role'] = 'VISITANTE';
    }

    // Tenant: se logado usa email/tenant do token; se for cliente visitante usa o eletricista selecionado
    if (email) {
      headersConfig['X-Tenant-ID'] = email;
    } else if (tenantPublico) {
      headersConfig['X-Tenant-ID'] = tenantPublico;
    }

    const authReq = request.clone({ setHeaders: headersConfig });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Apenas força logout se for 401 e houver token na sessão
        if (error.status === 401 && token && !request.url.includes('/auth/login')) {
          console.warn('Token expirado ou não autorizado. Redirecionando para login...');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
