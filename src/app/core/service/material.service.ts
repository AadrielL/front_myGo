import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly URL_MATERIAIS = 'http://localhost:8082/api/materiais';
  private readonly URL_ORCAMENTOS_BASE = 'http://localhost:8081/v1/orcamentos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-Tenant-ID': this.authService.getTenantId() || ''
    });
  }

  getOrcamentoPorId(orcamentoId: string): Observable<any> {
    const idLimpo = orcamentoId.trim();
    return this.http.get<any>(`${this.URL_ORCAMENTOS_BASE}/${idLimpo}`, { headers: this.getHeaders() });
  }

  gerarLevantamento(dados: any): Observable<any> {
    return this.http.post<any>(`${this.URL_MATERIAIS}/gerar`, dados, { headers: this.getHeaders() });
  }

 getDetalhesMaterial(orcamentoId: string): Observable<any> {
    const idLimpo = orcamentoId.trim();
    return this.http.get<any>(`${this.URL_MATERIAIS}/detalhes/${idLimpo}`, { headers: this.getHeaders() });
  }
}