import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DashboardService } from '../../core/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuário';
  userRole: string = '';
  stats: any = null; // Onde os dados do Java serão armazenados
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole().toUpperCase().trim();
    this.userName = this.authService.getUserName();

    if (this.userRole === 'ADMIN') {
      this.carregarDadosDashboard();
    }
  }

  carregarDadosDashboard() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do dashboard:', err);
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaCalculo() { this.router.navigate(['/quiz']); }
  irParaHistorico() { this.router.navigate(['/historico']); }
  irParaConfigPrecos() { this.router.navigate(['/config-precos']); }
}