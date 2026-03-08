import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-precos',
  templateUrl: './config-precos.component.html',
  styleUrls: ['./config-precos.component.css'],
  standalone: false
})
export class ConfigPrecosComponent implements OnInit {
  // Objeto para bind no formulário
  config = {
    valorMetroCabo25: 0,
    valorPontoEletrico: 0,
    diariaAjudante: 0,
    valorVisitaTecnica: 150.0
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Carregar preços atuais se necessário
  }

  salvarPrecos() {
    this.apiService.updatePrecos(this.config).subscribe({
      next: () => {
        alert('Tabela de preços atualizada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Erro ao atualizar preços.')
    });
  }
}