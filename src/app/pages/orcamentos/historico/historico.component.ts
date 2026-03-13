import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import necessário para o voltar()
import { DashboardService } from '../../../core/service/dashboard.service';
import { MaterialService } from '../../../core/service/material.service';
import { AuthService } from '../../../core/service/auth.service'; // Import necessário para o userRole

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'], // Faltava essa linha
  standalone: false
})
export class HistoricoComponent implements OnInit {
  listaOrcamentos: any[] = [];
  detalheMaterial: any = null;
  
  // ADICIONADO: Variável que o HTML está pedindo
  userRole: string = 'USER'; 

  constructor(
    private dashboardService: DashboardService,
    private materialService: MaterialService,
    private authService: AuthService, // Injetado para pegar o cargo
    private router: Router // Injetado para a função voltar()
  ) {}

  ngOnInit() {
    // Pega o cargo do usuário (ADMIN ou USER)
    this.userRole = this.authService.getUserRole()?.toUpperCase() || 'USER';
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.dashboardService.getHistorico().subscribe({
      next: (data) => this.listaOrcamentos = data,
      error: (err) => console.error('Erro ao carregar histórico:', err)
    });
  }

  // ADICIONADO: Função que o botão "Voltar" do HTML chama
  voltar() {
    this.router.navigate(['/dashboard']);
  }

  // ADICIONADO: Função que os botões "Aceitar/Recusar" do HTML chamam
  alterarStatus(id: any, novoStatus: string) {
    console.log(`Alterando status do orçamento ${id} para ${novoStatus}`);
    // Aqui você pode implementar a chamada para o service depois
  }

  verDetalhes(orcamentoId: string) {
    this.materialService.getDetalhesMaterial(orcamentoId).subscribe(res => {
      this.detalheMaterial = res;
    });
  }
}