import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly URL_BASE = 'http://localhost:8081/v1/orcamentos';
  private readonly URL_ADMIN = 'http://localhost:8081/v1/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-User-Role': this.authService.getUserRole(),
      'X-Tenant-ID': this.authService.getTenantId()
    });
  }

  getServicosExtras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_ADMIN}/servicos-extras`, { headers: this.getHeaders() });
  }

  gerarOrcamento(dados: any): Observable<any> {
    return this.http.post(`${this.URL_BASE}/gerar-quiz`, dados, { headers: this.getHeaders() });
  }

  getHistorico(): Observable<any[]> {
    const role = this.authService.getUserRole().toUpperCase();
    // Se for ADMIN, busca todos. Se não, busca só os "meus"
    const endpoint = role === 'ADMIN' ? `${this.URL_BASE}/todos` : `${this.URL_BASE}/meus-orcamentos`;
    return this.http.get<any[]>(endpoint, { headers: this.getHeaders() });
  }

  updatePrecos(config: any): Observable<any> {
    return this.http.put(`${this.URL_ADMIN}/config-precos`, config, { headers: this.getHeaders() });
  }
}