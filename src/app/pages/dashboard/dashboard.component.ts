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
  // Adicione este método dentro da classe DashboardComponent
solicitarUpgradePro(): void {
  const email = localStorage.getItem('userEmail');
  if (!email) {
    alert('Erro: E-mail não encontrado na sessão.');
    return;
  }

  this.authService.simularUpgradePago(email).subscribe({
    next: () => {
      alert('⚡ PAGAMENTO APROVADO! \n\nSeu plano foi atualizado para PRO. Você será deslogado para aplicar as novas permissões.');
      this.logout(); // Chama seu método de logout já existente
    },
    error: (err) => {
      console.error('Falha no upgrade:', err);
      alert('Erro ao processar pagamento simulado. Verifique se a API 8083 está online.');
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