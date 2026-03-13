import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  // URLs para os dois microserviços diferentes
  private apiMateriais = 'http://localhost:8082/api/materiais'; 
  private apiCalculadora = 'http://localhost:8081/v1/orcamentos';

  constructor(private http: HttpClient) {}

  // Busca dados do Quiz que o cliente fez (API 8081)
  getOrcamentoPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiCalculadora}/${id}`);
  }

  // Gera a lista técnica final (API 8082)
  gerarLevantamento(payload: any): Observable<any> {
    return this.http.post(`${this.apiMateriais}/gerar`, payload);
  }
 getDetalhesMaterial(orcamentoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiCalculadora}/orcamento/${orcamentoId}`);
  }
}