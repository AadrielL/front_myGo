import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialService } from '../../core/service/material.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-levantamento',
  templateUrl: './levantamento.component.html',
  styleUrls: ['./levantamento.component.css'], // Certifique-se que esta linha existe
  standalone: false
})
export class LevantamentoComponent implements OnInit {
  materialForm!: FormGroup;
  dadosQuizPreco: any;
  loading: boolean = false;
  
  exibirSucesso: boolean = false;
  mensagemDinamica: string = '';
  linkWhats: string = '';
  userRole: string = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private materialService: MaterialService,
    private authService: AuthService 
  ) {
    const nav = this.router.getCurrentNavigation();
    this.dadosQuizPreco = nav?.extras.state?.['dadosQuiz'];
  }

  ngOnInit(): void {
    if (!this.dadosQuizPreco) {
      this.router.navigate(['/quiz']);
      return;
    }

    this.userRole = this.authService.getUserRole() || 'VISITANTE';

    this.materialForm = this.fb.group({
      qtdQuartos: [1, [Validators.required, Validators.min(0)]],
      qtdBanheiros: [1, [Validators.required, Validators.min(1)]],
      qtdCozinhas: [1, [Validators.required, Validators.min(1)]],
      qtdSalas: [1, [Validators.required, Validators.min(0)]]
    });
  }

  confirmarLevantamento() {
    this.loading = true; // Ativa o botão "Processando..."
    
    const payload = {
      ...this.dadosQuizPreco,
      ...this.materialForm.value
    };

    this.materialService.gerarLevantamento(payload).subscribe({
      next: (res: any) => {
        // ESSENCIAL: Destrava o estado de loading
        this.loading = false; 

        if (this.userRole === 'ADMIN') {
          alert('Levantamento salvo com sucesso!');
          this.router.navigate(['/dashboard']);
        } else {
          const nomeEletricista = this.authService.getUserName() || 'Eletricista';
          const nomeCliente = res.clienteNome || 'Cliente';
          
          this.mensagemDinamica = `Recebemos suas informações! O eletricista <strong>${nomeEletricista}</strong> entrará em contato em breve.`;
          
          const fone = "5511999999999"; 
          const texto = encodeURIComponent(`Olá, realizei o levantamento para a obra de ${nomeCliente}.`);
          this.linkWhats = `https://wa.me/${fone}?text=${texto}`;
          
          // MUDA A TELA: Esconde o form e mostra o sucesso
          this.exibirSucesso = true; 
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro no processamento:', err);
        alert('Erro ao processar materiais. Verifique o console do backend.');
      }
    });
  }
}