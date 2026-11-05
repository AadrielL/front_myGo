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

   * Obtém dados gerais do dashboard (chama /stats).

   */

  getDadosDashboard(): Observable<any> {

    return this.http.get(`${this.URL_DASHBOARD}/stats`);

  }



  obterDadosDashboard(): Observable<any> {

    return this.getDadosDashboard();

  }



  gerarMensagemCapitalEletrica(nomeCliente: string, itensMateriais: any[]): string {
    const nomeProfissional = localStorage.getItem('userNome') || localStorage.getItem('nome_eletricista') || 'Eletricista Parceiro';
    const regiao = localStorage.getItem('regiao_eletricista') || 'Palmas/TO';

    let msg = '⚡ *SOLICITAÇÃO DE COTAÇÃO — CAPITAL ELÉTRICA (PALMAS/TO)*\n';
    msg += 'Profissional: *' + nomeProfissional + '*\n';
    msg += 'Obra / Cliente: *' + nomeCliente + '* (' + regiao + ')\n';
    msg += '-------------------------------------------\n';
    msg += '*LISTA DE MATERIAIS DIMENSIONADOS (NBR 5410):*\n';

    if (itensMateriais && itensMateriais.length > 0) {
      itensMateriais.forEach(item => {
        msg += '• ' + item.quantidade + ' ' + (item.unidade || 'un') + ' - ' + item.descricao + '\n';
      });
    } else {
      msg += '• Cabos Flexíveis antichama 2.5mm² e 6.0mm²\n';
      msg += '• Disjuntores DIN Curva C e Disjuntor Geral\n';
      msg += '• Dispositivo DPS 20kA + IDR 40A 30mA\n';
      msg += '• Eletrodutos corrugados e caixas 4x2\n';
    }

    msg += '-------------------------------------------\n';
    msg += 'Solicito cotação e condições de entrega/retirada em Palmas/TO.';
    return msg;
  }
}
