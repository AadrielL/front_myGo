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
  stats: any = null;
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole().toUpperCase().trim();
    this.userName = this.authService.getUserName();

    // Inicia o carregamento se for ADMIN
    if (this.userRole === 'ADMIN') {
      this.carregarDadosDashboard();
    }
  }

  carregarDadosDashboard() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('Dados recebidos do Java:', data); // Verifique isso no F12
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro na conexão com o Java:', err);
        this.loading = false;
        // Mock de emergência para a UI não travar se o Java falhar
        this.stats = { totalOrcamentos: 0, taxaConversao: 0, statusCount: {} };
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
} 