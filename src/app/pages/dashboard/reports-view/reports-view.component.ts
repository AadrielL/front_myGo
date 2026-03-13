 import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/service/dashboard.service';

@Component({
  selector: 'app-reports-view',
  standalone: false, // Agora o AppModule aceita ele nas declarations
  template: `
    <div class="chart-card">
      <h3 style="margin-bottom: 1.5rem; color: var(--primary);">Desempenho e Relatórios</h3>
      <div *ngIf="stats" class="kpi-grid">
        <div class="kpi-card">
          <div>
            <small style="color: #666;">Total de Orçamentos</small>
            <h4 style="margin: 0; font-size: 1.5rem;">{{ stats.totalOrcamentos }}</h4>
          </div>
        </div>
        <div class="kpi-card">
          <div>
            <small style="color: #666;">Taxa de Conversão</small>
            <h4 style="margin: 0; font-size: 1.5rem; color: var(--success);">{{ stats.taxaConversao }}%</h4>
          </div>
        </div>
      </div>
      <div *ngIf="!stats" style="padding: 2rem; text-align: center; color: #999;">
        Sincronizando com o servidor...
      </div>
    </div>
  `
})
export class ReportsViewComponent implements OnInit {
  stats: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erro ao buscar stats:', err)
    });
  }
}