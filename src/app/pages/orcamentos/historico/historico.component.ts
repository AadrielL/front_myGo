import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/service/dashboard.service';
import { MaterialService } from '../../../core/service/material.service';
import { AuthService } from '../../../core/service/auth.service';
import { ApiService } from '../../../core/service/api.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
  standalone: false
})
export class HistoricoComponent implements OnInit {
  listaOrcamentos: any[] = [];
  detalheMaterial: any = null;
  userRole: string = 'USER'; 
  loading: boolean = false;
  mostrarModal: boolean = false;
  verLixeira: boolean = false; // Controle de visualização da lixeira

  constructor(
    private dashboardService: DashboardService,
    private materialService: MaterialService,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const role = this.authService.getUserRole();
    this.userRole = role ? role.toUpperCase() : 'USER';
    this.carregarProjetos(true);
  }

  // Alterna entre a lista de ativos e a lixeira
  alternarVisualizacao() {
    this.verLixeira = !this.verLixeira;
    this.carregarProjetos(true);
  }

  carregarProjetos(force = false) {
    this.loading = true;
    this.cdRef.detectChanges();

    // Decide qual lista buscar baseada no estado da variável verLixeira
    const request = this.verLixeira 
      ? this.dashboardService.getLixeira() 
      : this.dashboardService.getHistorico(force);

    request.subscribe({
      next: (data: any[]) => {
        this.listaOrcamentos = data.map(orc => ({
          ...orc,
          id: orc.id || orc.orcamentoId,
          clienteNome: orc.clienteNome || orc.cliente_nome || 'Cliente sem nome',
          dataExibicao: orc.dataCriacao || orc.data_creacao,
          valorExibicao: orc.valorTotal || orc.valor_total || orc.valorEstimado || 0,
          status: orc.status || 'PENDENTE'
        }));
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Erro ao carregar projetos:", err);
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  // --- AÇÕES DE LIXEIRA ---

  confirmarRecusar(id: string) {
    if (confirm("Deseja enviar este orçamento para a lixeira? Ele será excluído permanentemente em 7 dias.")) {
      this.dashboardService.recusarOrcamento(id).subscribe({
        next: () => {
          this.carregarProjetos(true);
        },
        error: () => alert('Erro ao mover para a lixeira.')
      });
    }
  }

  restaurar(id: string) {
    this.dashboardService.restaurarOrcamento(id).subscribe({
      next: () => {
        alert("Orçamento restaurado com sucesso!");
        this.carregarProjetos(true);
      },
      error: () => alert('Erro ao restaurar orçamento.')
    });
  }

  // --- GERENCIAMENTO DE STATUS E NAVEGAÇÃO ---

  alterarStatus(id: any, novoStatus: string) {
    this.dashboardService.alterarStatus(id, novoStatus).subscribe({
      next: () => this.carregarProjetos(true),
      error: () => alert('Erro ao atualizar status.')
    });
  }

  capturarParaLevantamento(id: string) {
    this.router.navigate(['/levantamento'], { queryParams: { orcamentoId: id } });
  }

  // --- MODAL E MATERIAIS ---

  verDetalhes(orcamentoId: string) {
    if (!orcamentoId) return;

    this.loading = true;
    this.detalheMaterial = null;
    this.mostrarModal = false;
    this.cdRef.detectChanges();

    this.materialService.getDetalhesMaterial(orcamentoId).subscribe({
      next: (res: any) => {
        if (!res) {
          this.loading = false;
          alert("Lista de materiais não encontrada.");
          return;
        }

        this.detalheMaterial = {
          clienteNome: res.clienteNome,
          valorTotalEstimado: res.valorTotalEstimado || 0,
          avisoTecnico: res.avisoTecnico || '',
          dataGeracao: new Date(),
          categorias: this.organizarMateriais(res.materiais || [])
        };

        this.loading = false;
        this.mostrarModal = true;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Erro detalhes:", err);
        this.loading = false;
        this.cdRef.detectChanges();
        alert('Este orçamento ainda não possui uma lista gerada.');
      }
    });
  }

  organizarMateriais(materiais: any[]) {
    const categorias: any = {
      'Fios e Cabos': [],
      'Disjuntores': [],
      'Proteção e Outros': []
    };

    materiais.forEach(item => {
      const desc = item.descricao.toLowerCase();
      if (desc.includes('cabo') || desc.includes('fio') || desc.includes('circuito')) {
        categorias['Fios e Cabos'].push(item);
      } else if (desc.includes('disjuntor')) {
        categorias['Disjuntores'].push(item);
      } else {
        categorias['Proteção e Outros'].push(item);
      }
    });

    return categorias;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.cdRef.detectChanges();
  }

  // --- MODAL DE MÃO DE OBRA (ETAPA 3) ---
  mostrarModalMaoDeObra: boolean = false;
  detalheOrcamento: any = null;
  dadosSnapshot: any = null;

  verDetalhesMaoDeObra(orcamentoId: string) {
    if (!orcamentoId) return;

    this.loading = true;
    this.detalheOrcamento = null;
    this.dadosSnapshot = null;
    this.mostrarModalMaoDeObra = false;
    this.cdRef.detectChanges();

    this.materialService.getOrcamentoPorId(orcamentoId).subscribe({
      next: (orc: any) => {
        this.loading = false;
        if (!orc) {
          alert('Orçamento não encontrado.');
          return;
        }

        this.detalheOrcamento = orc;
        if (orc.dadosTecnicosSnapshot) {
          try {
            this.dadosSnapshot = typeof orc.dadosTecnicosSnapshot === 'string'
              ? JSON.parse(orc.dadosTecnicosSnapshot)
              : orc.dadosTecnicosSnapshot;
          } catch (e) {
            this.dadosSnapshot = null;
          }
        }

        this.mostrarModalMaoDeObra = true;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do orçamento:', err);
        this.loading = false;
        this.cdRef.detectChanges();
        alert('Não foi possível carregar os detalhes deste orçamento.');
      }
    });
  }

  fecharModalMaoDeObra() {
    this.mostrarModalMaoDeObra = false;
    this.cdRef.detectChanges();
  }

  voltar() { this.router.navigate(['/dashboard-main']); }

  imprimirDetalhe() {
    setTimeout(() => window.print(), 200);
  }

  formatarData(data: any): string {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d.getTime())) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  }

  formatarMoeda(valor: any): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getCategorias(): { key: string; value: any[] }[] {
    if (!this.detalheMaterial?.categorias) return [];
    return Object.entries(this.detalheMaterial.categorias).map(([key, value]) => ({ key, value: value as any[] }));
  }

  cotarCapitalEletrica() {
    if (!this.detalheMaterial) return;
    const nomeCliente = this.detalheMaterial.clienteNome || 'Cliente';
    const itens = this.detalheMaterial.itens || [];
    const msg = this.apiService.gerarMensagemCapitalEletrica(nomeCliente, itens);
    // WhatsApp comercial Capital Eletrica Palmas (exemplo padrão comercial)
    const numeroCapital = '556333222120';
    const url = `https://wa.me/${numeroCapital}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

}
