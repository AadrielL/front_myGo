import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly IS_LOCAL =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  private readonly URL_MATERIAIS = this.IS_LOCAL
    ? 'http://localhost:8082/api/materiais'
    : 'https://www.comandosamoris.tech/svc/materiais/api/materiais';
  private readonly URL_ORCAMENTOS_BASE = this.IS_LOCAL
    ? 'http://localhost:8081/v1/orcamentos'
    : 'https://www.comandosamoris.tech/svc/calc/v1/orcamentos';

  constructor(private http: HttpClient) {}

  /**
   * Busca os dados técnicos de um orçamento específico pelo ID.
   */
  getOrcamentoPorId(orcamentoId: string): Observable<any> {
    const idLimpo = orcamentoId.trim();
    return this.http.get<any>(`${this.URL_ORCAMENTOS_BASE}/${idLimpo}`);
  }

  obterOrcamentoPorId(orcamentoId: string): Observable<any> {
    return this.getOrcamentoPorId(orcamentoId);
  }

  /**
   * Envia dados do levantamento técnico para cálculo de materiais elétricos.
   */
  gerarLevantamento(dados: any): Observable<any> {
    return this.http.post<any>(`${this.URL_MATERIAIS}/gerar`, dados);
  }

  /**
   * Obtém a lista detalhada de materiais calculados para um orçamento.
   */
  getDetalhesMaterial(orcamentoId: string): Observable<any> {
    const idLimpo = orcamentoId.trim();
    return this.http.get<any>(`${this.URL_MATERIAIS}/detalhes/${idLimpo}`);
  }

  obterDetalhesMaterial(orcamentoId: string): Observable<any> {
    return this.getDetalhesMaterial(orcamentoId);
  }
}