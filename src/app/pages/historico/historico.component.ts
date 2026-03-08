import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
  standalone: false
})
export class HistoricoComponent implements OnInit {
  listaOrcamentos: any[] = [];
  userRole: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.apiService.getHistorico().subscribe({
      next: (dados) => this.listaOrcamentos = dados,
      error: (err) => console.error('Erro ao carregar histórico', err)
    });
  }

  // Ação exclusiva do Admin
  alterarStatus(id: number, novoStatus: string) {
    // Usando endpoint dinâmico conforme sua ApiService
    this.apiService.updatePrecos({ id, status: novoStatus }).subscribe(() => {
      alert(`Status atualizado para ${novoStatus}`);
      this.carregarHistorico();
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}