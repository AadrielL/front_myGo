import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../core/service/dashboard.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.component.html',
  standalone: false
})
export class ReportsViewComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  private intervalId: any;

  // KPIs para o HTML
  totalOrcamentos: number = 0;
  ticketMedio: number = 0;

  // --- CONFIGURAÇÕES DO GRÁFICO DE PIZZA ---
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#a2f64e', '#3b82f6', '#f59e0b', '#ef4444'] }]
  };

  // --- CONFIGURAÇÕES DO GRÁFICO DE BARRAS ---
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false } // Esconde a legenda para as barras ficarem maiores
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Média R$', backgroundColor: '#3b82f6' }]
  };

  constructor(
    private dashboardService: DashboardService,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.carregarDados();
    // Atualiza automaticamente a cada 30 minutos
    this.intervalId = setInterval(() => this.carregarDados(true), 1800000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  carregarDados(force = false) {
    this.loading = true;
    
    // Pegamos a lista do histórico para processar as médias
    this.dashboardService.getHistorico(force).subscribe({
      next: (dados: any[]) => {
        if (dados && dados.length > 0) {
          this.processarRelatorios(dados);
        }
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  private processarRelatorios(dados: any[]) {
    this.totalOrcamentos = dados.length;
    
    const statsMap: any = {};
    const mensalMap: { [key: string]: { soma: number, qtd: number } } = {};
    let somaTotal = 0;

    dados.forEach(orc => {
      // Normalização de campos (igual no HistoricoComponent)
      const status = orc.status || 'PENDENTE';
      const valor = orc.valorTotal || orc.valor_total || orc.valorEstimado || 0;
      const dataRaw = orc.dataCriacao || orc.data_creacao;
      
      // 1. Contagem por Status
      statsMap[status] = (statsMap[status] || 0) + 1;
      somaTotal += valor;

      // 2. Média Mensal
      if (dataRaw) {
        const d = new Date(dataRaw);
        // Formato: Mês/Ano (ex: 3/2026)
        const chaveMes = `${d.getMonth() + 1}/${d.getFullYear()}`;
        if (!mensalMap[chaveMes]) mensalMap[chaveMes] = { soma: 0, qtd: 0 };
        mensalMap[chaveMes].soma += valor;
        mensalMap[chaveMes].qtd += 1;
      }
    });

    this.ticketMedio = somaTotal / (this.totalOrcamentos || 1);

    // 3. Montar Pizza (Novo objeto para disparar detecção do Chart.js)
    this.pieChartData = {
      labels: Object.keys(statsMap),
      datasets: [{
        data: Object.values(statsMap) as number[],
        backgroundColor: ['#a2f64e', '#3b82f6', '#f59e0b', '#ef4444']
      }]
    };

    // 4. Montar Barras
    const meses = Object.keys(mensalMap);
    this.barChartData = {
      labels: meses,
      datasets: [{
        label: 'Média por Orçamento (R$)',
        data: meses.map(m => mensalMap[m].soma / mensalMap[m].qtd),
        backgroundColor: '#3b82f6',
        borderRadius: 8 // Estilo MyGo
      }]
    };
  }
}