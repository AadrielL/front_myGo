import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // MANTIDO: Todas as suas URLs originais
  private readonly URL_ORCAMENTOS = 'http://localhost:8081/v1/orcamentos';
  private readonly URL_ADMIN = 'http://localhost:8081/v1/admin';
  private readonly URL_DASHBOARD = 'http://localhost:8081/api/v1/dashboard';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-User-Role': this.authService.getUserRole(),
      'X-Tenant-ID': this.authService.getTenantId()
    });
  }

  // MANTIDO: Lógica de payload com data que você criou
  gerarOrcamento(quiz: any): Observable<any> {
    const payload = { ...quiz, dataProcessamento: new Date().toLocaleDateString('pt-BR') };
    return this.http.post(`${this.URL_ORCAMENTOS}/gerar-quiz`, payload, { headers: this.getHeaders() });
  }

  // MANTIDO: Métodos de Configuração
  getConfig(): Observable<any> {
    return this.http.get(`${this.URL_ADMIN}/config`, { headers: this.getHeaders() });
  }

  updatePrecos(config: any): Observable<any> {
    return this.http.put(`${this.URL_ADMIN}/config`, config, { headers: this.getHeaders() });
  }

  // MANTIDO: Seu método original de buscar extras
  getServicosExtras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_ADMIN}/servicos-extras`, { headers: this.getHeaders() });
  }

  // ADICIONADO: Alias para o componente unificado não quebrar (chama o seu método acima)
  listarServicosExtras(): Observable<any[]> {
    return this.getServicosExtras();
  }

  // MANTIDO: Adição e Deleção
  adicionarServicoExtra(servico: any): Observable<any> {
    return this.http.post(`${this.URL_ADMIN}/servicos-extras`, servico, { headers: this.getHeaders() });
  }

  deletarServicoExtra(id: number): Observable<any> {
    return this.http.delete(`${this.URL_ADMIN}/servicos-extras/${id}`, { headers: this.getHeaders() });
  }

  // MANTIDO: Caso você precise de algo do Dashboard futuramente
  getDadosDashboard(): Observable<any> {
    return this.http.get(`${this.URL_DASHBOARD}`, { headers: this.getHeaders() });
  }
}