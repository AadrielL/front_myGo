import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  private saveSession(res: any): void {
    if (res.token) localStorage.setItem('token', res.token);
    if (res.role) localStorage.setItem('userRole', res.role.toUpperCase());
    
    const nomeUsuario = res.nome || res.name || 'Usuário';
    localStorage.setItem('userName', nomeUsuario);
    
    // Essencial para o TenantId das APIs 8081 e 8082
    if (res.email) localStorage.setItem('userEmail', res.email);
  }

  isAuthenticated(): boolean { return !!localStorage.getItem('token'); }
  getUserRole(): string { return localStorage.getItem('userRole') || 'VISITANTE'; }
  getUserName(): string { return localStorage.getItem('userName') || 'Eletricista Mygo'; }

  getTenantId(): string {
    const email = localStorage.getItem('userEmail');
    return email && email !== 'undefined' ? email : 'admin@teste.com';
  }

  getPlanType(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'FREE';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.planType || 'FREE';
    } catch (e) {
      return 'FREE';
    }
  }

  logout(): void { 
    localStorage.clear(); 
    window.location.href = '/login';
  }
  simularUpgradePago(email: string): Observable<any> {
  // Simulando o payload que o Mercado Pago enviaria
  const payload = {
    payer_email: email,
    status: 'approved'
  };
  return this.http.post(`${this.API_URL}/api/payments/confirm`, payload);
  }
}