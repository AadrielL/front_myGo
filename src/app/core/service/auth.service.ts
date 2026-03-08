import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://orcamento-db.onrender.com';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    // Hack para testar modo ADMIN localmente
    if (credentials.email === 'admin@teste.com' && credentials.password === 'admin123') {
      const mockAdmin = {
        token: 'token-fake-admin',
        role: 'ADMIN',
        name: 'Adriell Admin',
        email: 'admin@teste.com'
      };
      this.saveSession(mockAdmin);
      return of(mockAdmin);
    }

    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  private saveSession(res: any): void {
    if (res.token) localStorage.setItem('token', res.token);
    if (res.role) localStorage.setItem('userRole', res.role.toUpperCase());
    if (res.name) localStorage.setItem('userName', res.name);
    if (res.email) localStorage.setItem('userEmail', res.email);
  }

  // Resolve o erro no material.service.ts
  getTenantId(): string {
    return localStorage.getItem('userEmail') || 'default_tenant';
  }

  // Resolve o erro no dashboard.component.ts
  getUserName(): string { 
    return localStorage.getItem('userName') || 'Eletricista'; 
  }

  getUserRole(): string { 
    return localStorage.getItem('userRole') || 'VISITANTE'; 
  }

  // Resolve o erro no dashboard.component.ts
  logout(): void { 
    localStorage.clear(); 
  }

  // Resolve o erro no auth.guard.ts
  isLoggedIn(): boolean { 
    return !!localStorage.getItem('token'); 
  }
}