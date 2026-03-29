import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. SE FOR LOGIN OU REGISTER, PASSA DIRETO (SEM HEADERS EXTRAS)
    // Isso evita que o CORS do Auth-Service (8083) bloqueie a chamada
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return next.handle(request);
    }

    // 2. BUSCA OS DADOS PARA AS DEMAIS REQUISIÇÕES (8081, 8082)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    let headersConfig: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // 3. SÓ ADICIONA SE O TOKEN EXISTIR
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    // 4. ADICIONA OS HEADERS QUE A CALCULADORA (8081) ESPERA
    if (role) headersConfig['X-User-Role'] = role;
    if (email) headersConfig['X-Tenant-ID'] = email;

    const authReq = request.clone({ setHeaders: headersConfig });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 5. TRATAMENTO DE ERRO (IGNORA SE FOR ERRO NO PRÓPRIO LOGIN)
        if ((error.status === 401 || error.status === 403) && !request.url.includes('/auth/login')) {
          console.warn('Acesso negado ou Token expirado. Redirecionando...');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}