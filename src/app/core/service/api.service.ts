import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly URL_ORCAMENTOS = 'http://localhost:8081/v1/orcamentos';
  private readonly URL_ADMIN = 'http://localhost:8081/v1/admin';
  private readonly URL_DASHBOARD = 'http://localhost:8081/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  /**
   * Envia as respostas do quiz para processamento e geração do cálculo de orçamento.
   */
  gerarOrcamento(quiz: any): Observable<any> {
    const payload = { ...quiz, dataProcessamento: new Date().toLocaleDateString('pt-BR') };
    return this.http.post(`${this.URL_ORCAMENTOS}/gerar-quiz`, payload);
  }

  /**
   * Obtém as configurações de precificação base cadastradas.
   */
  getConfig(): Observable<any> {
    return this.http.get(`${this.URL_ADMIN}/config`);
  }

  obterConfiguracao(): Observable<any> {
    return this.getConfig();
  }

  /**
   * Atualiza a tabela de preços base.
   */
  updatePrecos(config: any): Observable<any> {
    return this.http.put(`${this.URL_ADMIN}/config`, config);
  }

  atualizarPrecos(config: any): Observable<any> {
    return this.updatePrecos(config);
  }

  /**
   * Lista todos os serviços extras adicionais para o quiz.
   */
  listarServicosExtras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_ADMIN}/servicos-extras`);
  }

  getServicosExtras(): Observable<any[]> {
    return this.listarServicosExtras();
  }

  /**
   * Cadastra um novo serviço adicional.
   */
  adicionarServicoExtra(servico: any): Observable<any> {
    return this.http.post(`${this.URL_ADMIN}/servicos-extras`, servico);
  }

  /**
   * Remove um serviço adicional pelo ID.
   */
  deletarServicoExtra(id: number): Observable<any> {
    return this.http.delete(`${this.URL_ADMIN}/servicos-extras/${id}`);
  }

  /**
   * Obtém dados gerais do dashboard (reserva para uso futuro).
   */
  getDadosDashboard(): Observable<any> {
    return this.http.get(`${this.URL_DASHBOARD}`);
  }

  obterDadosDashboard(): Observable<any> {
    return this.getDadosDashboard();
  }
}