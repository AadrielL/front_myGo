import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly URL_DASHBOARD = 'http://localhost:8081/api/v1/dashboard';
  private readonly URL_HISTORICO = 'http://localhost:8081/v1/historico';

  private cacheStats: any = null;
  private cacheHistorico: any[] | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtém as estatísticas gerais para os cards do Dashboard com cache em memória.
   */
  getStats(forceRefresh = false): Observable<any> {
    if (this.cacheStats && !forceRefresh) return of(this.cacheStats);
    
    return this.http.get<any>(`${this.URL_DASHBOARD}/stats`).pipe(
      tap(res => this.cacheStats = res)
    );
  }

  obterEstatisticas(forceRefresh = false): Observable<any> {
    return this.getStats(forceRefresh);
  }

  /**
   * Obtém a lista de orçamentos ativos no histórico.
   */
  getHistorico(forceRefresh = false): Observable<any[]> {
    if (this.cacheHistorico && !forceRefresh) return of(this.cacheHistorico);
    
    return this.http.get<any[]>(this.URL_HISTORICO).pipe(
      tap(res => this.cacheHistorico = res)
    );
  }

  obterHistorico(forceRefresh = false): Observable<any[]> {
    return this.getHistorico(forceRefresh);
  }

  /**
   * Altera o status operacional de um orçamento (PENDENTE, EM_EXECUCAO, FINALIZADO, etc).
   */
  alterarStatus(id: string, status: string): Observable<any> {
    const cleanId = id.trim(); 
    return this.http.patch(`${this.URL_HISTORICO}/${cleanId}/status?novoStatus=${status}`, {}).pipe(
      tap(() => this.limparCache())
    );
  }

  /**
   * Exclui permanentemente um orçamento pelo ID.
   */
  excluirOrcamento(id: string): Observable<any> {
    return this.http.delete(`${this.URL_HISTORICO}/${id.trim()}`).pipe(
      tap(() => this.limparCache())
    );
  }

  /**
   * Envia um orçamento para a lixeira temporária.
   */
  recusarOrcamento(id: string): Observable<any> {
    return this.http.delete(`${this.URL_HISTORICO}/${id.trim()}`).pipe(
      tap(() => this.limparCache())
    );
  }

  /**
   * Restaura um orçamento que estava na lixeira de volta para os ativos.
   */
  restaurarOrcamento(id: string): Observable<any> {
    return this.http.post(`${this.URL_HISTORICO}/${id.trim()}/restaurar`, {}).pipe(
      tap(() => this.limparCache())
    );
  }

  /**
   * Obtém a lista de orçamentos descartados na lixeira.
   */
  getLixeira(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_HISTORICO}/lixeira`);
  }

  obterLixeira(): Observable<any[]> {
    return this.getLixeira();
  }

  /**
   * Invalida os dados em cache para forçar nova requisição nas próximas chamadas.
   */
  limparCache(): void {
    this.cacheStats = null;
    this.cacheHistorico = null;
  }
}