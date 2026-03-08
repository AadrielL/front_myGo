import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../core/service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  standalone: false
})
export class QuizComponent implements OnInit {
  quizForm!: FormGroup;
  step: number = 1;
  loading: boolean = false;
  resultado: any = null; 
  servicosExtrasDisponiveis: any[] = [];

  selecaoCards = {
    chuveiro: false, ar: false, camera: false, motor: false, cerca: false
  };

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public router: Router // Alterado para public para usar no HTML
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      nomeCliente: ['', Validators.required],
      metragemM2: [null, [Validators.required, Validators.min(1)]],
      qtdPontosEletrica: [null, Validators.required],
      tipoServico: ['NOVA'], 
      comInfra: [true],
      distanciaQuadroPoste: [null, Validators.required],
      qtdChuveiro: [0],
      qtdArCondicionado: [0],
      qtdCameras: [0],
      qtdMotores: [0],
      metrosCerca: [0],
      diariaAjudante: [120.0, Validators.required], 
      extrasDinamicos: this.fb.array([]) 
    });

    this.carregarServicosDoBanco();
  }

  get extrasDinamicos() {
    return this.quizForm.get('extrasDinamicos') as FormArray;
  }

  carregarServicosDoBanco() {
    this.apiService.getServicosExtras().subscribe({
      next: (servicos) => {
        this.servicosExtrasDisponiveis = servicos;
        const extrasArray = this.extrasDinamicos;
        extrasArray.clear();
        servicos.forEach(() => {
          extrasArray.push(this.fb.group({ quantidade: [0], selecionado: [false] }));
        });
      }
    });
  }

  toggleCard(tipo: keyof typeof this.selecaoCards) {
    this.selecaoCards[tipo] = !this.selecaoCards[tipo];
    const campos: any = { 
      chuveiro: 'qtdChuveiro', ar: 'qtdArCondicionado', 
      camera: 'qtdCameras', motor: 'qtdMotores', cerca: 'metrosCerca' 
    };
    if (!this.selecaoCards[tipo]) this.quizForm.get(campos[tipo])?.setValue(0);
  }

  nextStep() { if (this.step < 5) this.step++; }
  prevStep() { if (this.step > 1) this.step--; }

  // Função para levar ao levantamento de materiais via site
  irParaMaterial() {
    const dadosParaTransporte = {
      clienteNome: this.quizForm.value.nomeCliente,
      metragemM2: this.quizForm.value.metragemM2,
      qtdChuveiros: this.quizForm.value.qtdChuveiro,
      incluirArCondicionado: this.quizForm.value.qtdArCondicionado > 0
    };
    this.router.navigate(['/levantamento'], { state: { dadosQuiz: dadosParaTransporte } });
  }

  // Função para visita técnica pessoal
  agendarVisita() {
    alert('Solicitação de visita técnica enviada! Valor: R$ 150,00. Entraremos em contato.');
    this.router.navigate(['/dashboard']);
  }

  finalizarOrcamento() {
    if (this.quizForm.invalid) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.loading = true;
    const formValue = this.quizForm.value;

    const adicionais = [];
    if (formValue.qtdCameras > 0) adicionais.push({ tipo: 'CAMERA', quantidade: formValue.qtdCameras, metrosLineares: 0 });
    if (formValue.qtdMotores > 0) adicionais.push({ tipo: 'MOTOR', quantidade: formValue.qtdMotores, metrosLineares: 0 });
    if (formValue.metrosCerca > 0) adicionais.push({ tipo: 'CERCA', quantidade: 0, metrosLineares: formValue.metrosCerca });

    this.extrasDinamicos.controls.forEach((control, i) => {
      if (control.value.selecionado && control.value.quantidade > 0) {
        adicionais.push({
          tipo: this.servicosExtrasDisponiveis[i].nome,
          quantidade: control.value.quantidade,
          metrosLineares: 0
        });
      }
    });

    const payload = { 
      ...formValue, 
      adicionais 
    };

    this.apiService.gerarOrcamento(payload).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
        this.step = 5;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao calcular orçamento no servidor.');
      }
    });
  }
}