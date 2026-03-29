import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly URL_DASHBOARD = 'http://localhost:8081/api/v1/dashboard';
  private readonly URL_HISTORICO = 'http://localhost:8081/v1/historico';

  private cacheStats: any = null;
  private cacheHistorico: any[] | null = null;

  // Não precisa mais injetar AuthService para pegar headers!
  constructor(private http: HttpClient) {}

  getStats(forceRefresh = false): Observable<any> {
    if (this.cacheStats && !forceRefresh) return of(this.cacheStats);
    
    // O Interceptor injeta os headers automaticamente
    return this.http.get<any>(`${this.URL_DASHBOARD}/stats`).pipe(
      tap(res => this.cacheStats = res)
    );
  }

  getHistorico(forceRefresh = false): Observable<any[]> {
    if (this.cacheHistorico && !forceRefresh) return of(this.cacheHistorico);
    
    return this.http.get<any[]>(this.URL_HISTORICO).pipe(
      tap(res => this.cacheHistorico = res)
    );
  }

  alterarStatus(id: string, status: string): Observable<any> {
    const cleanId = id.trim(); 
    return this.http.patch(`${this.URL_HISTORICO}/${cleanId}/status?novoStatus=${status}`, {}).pipe(
      tap(() => this.limparCache())
    );
  }

  excluirOrcamento(id: string): Observable<any> {
    return this.http.delete(`${this.URL_HISTORICO}/${id.trim()}`).pipe(
      tap(() => this.limparCache())
    );
  }

  limparCache() {
    this.cacheStats = null;
    this.cacheHistorico = null;
  }

  getLixeira(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_HISTORICO}/lixeira`);
  }

  recusarOrcamento(id: string): Observable<any> {
    return this.http.delete(`${this.URL_HISTORICO}/${id.trim()}`).pipe(
      tap(() => this.limparCache())
    );
  }

  restaurarOrcamento(id: string): Observable<any> {
    return this.http.post(`${this.URL_HISTORICO}/${id.trim()}/restaurar`, {}).pipe(
      tap(() => this.limparCache())
    );
  }
}