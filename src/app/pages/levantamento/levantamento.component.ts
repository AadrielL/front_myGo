import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../core/service/material.service';

@Component({
  selector: 'app-levantamento',
  templateUrl: './levantamento.component.html',
  standalone: false
})
export class LevantamentoComponent implements OnInit {
  levantamentoForm!: FormGroup;
  cliente: string = 'Carregando...';
  levantamentoResultado: any = null;
  orcamentoIdAtual: string | null = null;
  processando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.orcamentoIdAtual = params.get('orcamentoId');
      if (this.orcamentoIdAtual) {
        this.carregarDadosIniciais();
      }
    });
  }

  carregarDadosIniciais() {
    this.materialService.getOrcamentoPorId(this.orcamentoIdAtual!).subscribe({
      next: (orc: any) => {
        const dadosTecnicos = typeof orc.dadosTecnicosSnapshot === 'string' 
          ? JSON.parse(orc.dadosTecnicosSnapshot) 
          : orc.dadosTecnicosSnapshot || {};
        
        this.cliente = orc.clienteNome;

        this.levantamentoForm.patchValue({
          clienteNome: orc.clienteNome,
          areaTotalM2: dadosTecnicos.metragemM2 || 0,
          qtdChuveiros: dadosTecnicos.qtdChuveiro || 0,
          qtdPontosEletrica: dadosTecnicos.qtdPontosEletrica || 0,
          distanciaQuadroPoste: dadosTecnicos.distanciaQuadroPoste || 15
        });

        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar orçamento:', err)
    });
  }

  initForm() {
    this.levantamentoForm = this.fb.group({
      clienteNome: ['', Validators.required],
      areaTotalM2: [0, [Validators.required, Validators.min(1)]],
      qtdChuveiros: [0],
      qtdPontosEletrica: [0],
      qtdQuartos: [0],
      qtdSalas: [0],
      qtdCozinhas: [0],
      qtdBanheiros: [0],
      distanciaQuadroPoste: [15, Validators.required],
      modoEconomico: [false],
      observacoesTecnicas: ['']
    });
  }

  finalizar() {
    if (this.levantamentoForm.invalid) return;

    this.processando = true;
    // IMPORTANTE: Limpa o resultado anterior para mostrar o "Sincronizando"
    this.levantamentoResultado = null; 
    this.cdRef.detectChanges();

    const payload = {
      ...this.levantamentoForm.value,
      orcamentoId: this.orcamentoIdAtual
    };

    this.materialService.gerarLevantamento(payload).subscribe({
      next: (res: any) => {
        this.levantamentoResultado = res;
        this.processando = false;
        this.cdRef.detectChanges();
        // Rola a tela para o resultado automaticamente
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      },
      error: (err: any) => {
        this.processando = false;
        this.cdRef.detectChanges();
        alert('Erro ao gerar levantamento: ' + (err.error?.message || err.message));
      }
    });
  }

  imprimirPDF() { window.print(); }
  
  novoCalculo() {
    this.levantamentoResultado = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}