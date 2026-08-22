import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DashboardService } from '../../core/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuário';
  userRole: string = '';
  sidebarCollapsed: boolean = false; 
  loading: boolean = false;
  stats: any = null;

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()?.toUpperCase() || 'USER';
    this.userName = this.authService.getUserName() || 'Eletricista Mygo';
      this.carregarDadosDashboard();
    }

  onToggleSidebar(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  carregarDadosDashboard(force = false): void {
    this.loading = true;
    this.dashboardService.getStats(force).subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
        this.loading = false;
      }
    });
  }


  navegar(rota: string): void {
    this.router.navigate([rota]);
  }

  irParaAssinatura(): void {
    this.router.navigate(['/assinatura']);
  }

  logout(): void {
    this.dashboardService.limparCache();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 