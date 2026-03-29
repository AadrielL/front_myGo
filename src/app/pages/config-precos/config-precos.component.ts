import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/service/api.service';

@Component({
  selector: 'app-config-precos',
  templateUrl: './config-precos.component.html',
  standalone: false
})
export class ConfigPrecosComponent implements OnInit {
  isLoading = true;
  
  // Nomes das propriedades RIGOROSAMENTE iguais ao ConfigDTO.java
  config: any = {
    valorM2ComInfra: 0,
    valorM2SemInfra: 0,
    precoMotor: 0,
    precoCamera: 0,
    precoCerca: 0,
    valorDiaria: 0,
    valorPontoExtra: 0,
    areaBase: 100,
    pontosBase: 30
  };

  servicosExtras: any[] = [];
  novoServico = { nome: '', valor: 0, ativo: true };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.isLoading = true;
    this.apiService.getConfig().subscribe({
      next: (res) => {
        if (res) {
          this.config = res;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar configurações:', err);
        this.isLoading = false;
      }
    });

    this.apiService.listarServicosExtras().subscribe(res => {
      this.servicosExtras = res || [];
    });
  }

  salvarConfigGeral() {
    // Forçamos os valores base caso não venham do banco
    const payload = {
      ...this.config,
      areaBase: this.config.areaBase || 100,
      pontosBase: this.config.pontosBase || 30
    };

    console.log('Enviando ConfigDTO para o Java:', payload);
    
    this.apiService.updatePrecos(payload).subscribe({
      next: (res) => alert('Configurações atualizadas com sucesso!'),
      error: (err) => alert('Erro ao salvar: ' + err.message)
    });
  }

  adicionarExtra() {
    if (!this.novoServico.nome || this.novoServico.valor <= 0) return;
    this.apiService.adicionarServicoExtra(this.novoServico).subscribe(() => {
      this.carregarDados();
      this.novoServico = { nome: '', valor: 0, ativo: true };
    });
  }

  excluirExtra(id: number) {
    if (confirm('Deseja remover este serviço extra?')) {
      this.apiService.deletarServicoExtra(id).subscribe(() => this.carregarDados());
    }
  }
}