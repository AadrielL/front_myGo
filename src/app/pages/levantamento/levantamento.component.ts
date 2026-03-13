import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from '../../core/service/material.service';
@Component({
  selector: 'app-levantamento',
  templateUrl: './levantamento.component.html',
  styleUrls: ['./levantamento.component.css'],
  standalone: false // Garantindo que não dê erro de compilação no seu AppModule
})
export class LevantamentoComponent implements OnInit {
  levantamentoForm!: FormGroup;
  cliente: string = '';
  dadosQuiz: any;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Recupera os dados do Quiz anterior
    const storedData = localStorage.getItem('payload_quiz');
    if (!storedData) {
      this.router.navigate(['/quiz']);
      return;
    }

    this.dadosQuiz = JSON.parse(storedData);
    this.cliente = this.dadosQuiz.nomeCliente;

    this.levantamentoForm = this.fb.group({
      // Campos exatos para o seu microserviço de materiais
      clienteNome: [this.cliente, Validators.required],
      qtdQuartos: [0, [Validators.required, Validators.min(0)]],
      qtdSalas: [0, [Validators.required, Validators.min(0)]],
      qtdCozinhas: [0, [Validators.required, Validators.min(0)]],
      qtdBanheiros: [0, [Validators.required, Validators.min(0)]],
      areaTotalM2: [this.dadosQuiz.metragemM2 || 0],
      observacoestécnicas: ['']
    });
  }

  finalizar() {
    if (this.levantamentoForm.invalid) return;

    // Payload final unificado: Quiz + Levantamento
    const payloadFinal = {
      ...this.dadosQuiz,
      ...this.levantamentoForm.value
    };

    console.log('Enviando para o MaterialService (8082):', payloadFinal);

    this.materialService.gerarLevantamento(payloadFinal).subscribe({
      next: (res) => {
        console.log('Levantamento gerado com sucesso!', res);
        alert('Cálculo de materiais gerado com sucesso!');
        this.router.navigate(['/historico']);
      },
      error: (err) => {
        console.error('Erro no microserviço de materiais:', err);
        alert('Erro ao gerar levantamento. Verifique se o microserviço na 8082 está rodando.');
      }
    });
  }
}