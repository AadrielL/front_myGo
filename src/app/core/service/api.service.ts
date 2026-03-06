import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ajustado para o endpoint real do seu Java: /v1/orcamentos
  private readonly URL_BASE = 'http://localhost:8081/v1/orcamentos';

  constructor(private http: HttpClient) {}

  gerarOrcamento(dados: any): Observable<any> {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail') || 'tecnico@teste.com';
    const role = localStorage.getItem('userRole') || 'ADMIN';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-User-Role': role,
      'X-Tenant-ID': email
    });
    
    return this.http.post(`${this.URL_BASE}/gerar-quiz`, dados, { headers });
  }

  getHistorico(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.URL_BASE}/meus-orcamentos`, { headers });
  }

  // Novo método para carregar os serviços customizados do seu novo Controller
  getServicosExtras(): Observable<any[]> {
    const email = localStorage.getItem('userEmail') || 'tecnico@teste.com';
    const headers = new HttpHeaders().set('X-Tenant-ID', email);
    return this.http.get<any[]>(`http://localhost:8081/v1/admin/servicos-extras`, { headers });
  }
}