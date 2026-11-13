import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  verificarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/verificar-codigo`, { email, codigo }).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  reenviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reenviar-codigo`, { email });
  }

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
    if (res.planType) localStorage.setItem('userPlanType', res.planType);

    // Perfil multitenant
    if (res.tipoPerfil) localStorage.setItem('userTipoPerfil', res.tipoPerfil);
    if (res.tenantId) localStorage.setItem('userTenantId', res.tenantId);
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/auth/me`).pipe(
      tap((user: any) => {
        if (user) {
          if (user.nome) localStorage.setItem('userName', user.nome);
          if (user.role) localStorage.setItem('userRole', user.role.toUpperCase());
          if (user.email) localStorage.setItem('userEmail', user.email);
          if (user.planType) localStorage.setItem('userPlanType', user.planType);
        }
      })
    );
  }

  isAuthenticated(): boolean { return !!localStorage.getItem('token'); }
  getUserRole(): string { return localStorage.getItem('userRole') || 'VISITANTE'; }
  getUserName(): string { return localStorage.getItem('userName') || 'Eletricista Mygo'; }

  getTenantId(): string {
    const email = localStorage.getItem('userEmail');
    return email && email !== 'undefined' ? email : 'admin@teste.com';
  }

  getPlanType(): string {
    const savedPlan = localStorage.getItem('userPlanType');
    if (savedPlan) return savedPlan;
    const token = localStorage.getItem('token');
    if (!token) return 'FREE';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.planType || 'FREE';
    } catch {
      return 'FREE';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPlanType');
    localStorage.removeItem('userTipoPerfil');
    localStorage.removeItem('userTenantId');
  }

  // ── Assinatura / Pagamento ─────────────────────────────────────────────────

  /** Retorna o número de vagas vitalícias disponíveis */
  getVagasVitalicias(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/auth/vagas-vitalicias`);
  }

  /** Envia os dados do formulário MP Brick para o backend processar */
  processarPagamento(formData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/pagamento`, formData);
  }

  /** Recarrega os dados da sessão do usuário após uma assinatura ser concluída */
  refreshSession(): Observable<any> {
    return this.getMe();
  }
}
