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
  sidebarCollapsed: boolean = false; 
  loading: boolean = false;
  stats: any = null;

  isDarkMode: boolean = true;

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTema();
    this.userRole = this.authService.getUserRole()?.toUpperCase() || 'USER';
    this.userName = this.authService.getUserName() || 'Eletricista Mygo';
    
    // Sincroniza perfil atualizado do backend (Etapa 1)
    this.authService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.userName = user.nome || this.userName;
          this.userRole = (user.role || this.userRole).toUpperCase();
        }
      },
      error: () => {} // fallback silencioso para dados em cache
    });

    this.carregarDadosDashboard();
  }

  carregarTema(): void {
    const savedTheme = localStorage.getItem('mygo-theme') || 'dark';
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mygo-theme', theme);
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