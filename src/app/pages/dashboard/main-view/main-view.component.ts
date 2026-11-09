import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { DashboardService } from '../../../core/service/dashboard.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  standalone: false
})
export class MainViewComponent implements OnInit {
  userRole: string = '';
  userName: string = '';
  stats: any = null;
  loadingStats: boolean = false;
  aceitosCount: number = 0;
  pendentesCount: number = 0;

  ultimosOrcamentos: any[] = [];

  constructor(
    private router: Router, 
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.userRole = role ? role.toUpperCase() : 'USER';
    this.userName = this.authService.getUserName() || 'Usuário';

    this.carregarMetricas();
    this.carregarUltimos();
  }

  carregarMetricas(): void {
    this.loadingStats = true;
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loadingStats = false;
        if (res && res.statusCount) {
          this.aceitosCount = res.statusCount['ACEITO'] || res.statusCount['FINALIZADO'] || 0;
          this.pendentesCount = res.statusCount['PENDENTE'] || res.statusCount['EM_ANALISE'] || 0;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar métricas do dashboard:', err);
        this.loadingStats = false;
      }
    });
  }

  carregarUltimos(): void {
    this.dashboardService.getHistorico().subscribe({
      next: (dados: any[]) => {
        if (dados && dados.length > 0) {
          this.ultimosOrcamentos = dados.slice(0, 4).map(orc => ({
            id: orc.id || orc.orcamentoId,
            clienteNome: orc.clienteNome || orc.cliente_nome || 'Cliente',
            valorTotal: orc.valorTotal || orc.valor_total || orc.valorEstimado || 0,
            status: orc.status || 'PENDENTE',
            data: orc.dataCriacao || orc.data_creacao
          }));
        }
      },
      error: () => {}
    });
  }

  formatarMoeda(valor: any): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}