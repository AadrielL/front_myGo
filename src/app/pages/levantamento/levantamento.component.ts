import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../core/service/material.service';

@Component({
  selector: 'app-levantamento',
  templateUrl: './levantamento.component.html',
  styleUrls: ['./levantamento.component.css'],
  standalone: false
})
export class LevantamentoComponent implements OnInit {
  levantamentoForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute // Para pegar o ID da URL
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // 1. Verifica se veio um ID de orçamento do histórico
    const orcamentoId = this.route.snapshot.queryParamMap.get('orcamentoId');

    if (orcamentoId) {
      this.loading = true;
      this.materialService.getOrcamentoPorId(orcamentoId).subscribe({
        next: (orc) => {
          // 2. Preenche o formulário automaticamente com os dados do cliente
          this.levantamentoForm.patchValue({
            clienteNome: orc.clienteNome,
            areaTotalM2: orc.metragemM2 || 0,
            // Adicione outros campos que venham do seu modelo de Orçamento
          });
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
    }
  }

  initForm() {
    this.levantamentoForm = this.fb.group({
      clienteNome: ['', Validators.required],
      qtdQuartos: [0, [Validators.required, Validators.min(0)]],
      qtdSalas: [0, [Validators.required, Validators.min(0)]],
      qtdCozinhas: [0, [Validators.required, Validators.min(0)]],
      qtdBanheiros: [0, [Validators.required, Validators.min(0)]],
      qtdChuveiros: [0, [Validators.required, Validators.min(0)]],
      areaTotalM2: [0],
      observacoestécnicas: ['']
    });
  }

  finalizar() {
    if (this.levantamentoForm.invalid) return;
    
    this.materialService.gerarLevantamento(this.levantamentoForm.value).subscribe({
      next: () => {
        alert('Levantamento NBR5410 gerado com sucesso!');
        this.router.navigate(['/historico']);
      },
      error: (err) => alert('Erro ao gerar materiais. Verifique a porta 8082.')
    });
  }
}