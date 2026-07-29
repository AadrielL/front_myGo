import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/service/api.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.97)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.97)' }))
      ])
    ])
  ]
})
export class QuizComponent implements OnInit {
  quizForm!: FormGroup;
  passoAtual: number = 1;
  sabeDistancia: boolean = false;
  servicosExtras: any[] = [];
  carregando: boolean = false;
  quizAberto: boolean = false;

  // Controle do Modal
  exibirModal: boolean = false;
  resultadoCalculo: any = null;
  numeroWhatsApp: string = '';

  // Opções estilo "múltipla escolha" para tipo de obra
  opcoesTipoObra = [
    { value: 'RESIDENCIAL', label: 'Residencial', icon: '🏠', desc: 'Casas e apartamentos' },
    { value: 'COMERCIAL',   label: 'Comercial',   icon: '🏢', desc: 'Lojas e escritórios' },
    { value: 'REFORMA',     label: 'Reforma',     icon: '🔨', desc: 'Adequação elétrica' },
    { value: 'ALTO_PADRAO', label: 'Alto Padrão', icon: '⭐', desc: 'Projetos especiais' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      nomeCliente: ['', Validators.required],
      metragemM2: [0, [Validators.required, Validators.min(1)]],
      comInfra: [true],
      complexidade: ['RESIDENCIAL'],
      distanciaQuadroPoste: [0],
      qtdChuveiro: [0],
      qtdArCondicionado: [0],
      qtdCameras: [0],
      metrosCerca: [0],
      qtdPontosEletrica: [0],
      qtdMotoresPortao: [0],
      servicosAdicionaisUI: this.fb.array([])
    });
    this.carregarServicosDoAdmin();
  }

  get totalPassos(): number {
    return this.servicosExtras.length > 0 ? 5 : 4;
  }

  get progressoPorcentagem(): number {
    return (this.passoAtual / this.totalPassos) * 100;
  }

  get ehUltimoPasso(): boolean {
    return this.passoAtual === this.totalPassos;
  }

  abrirQuiz() {
    this.quizAberto = true;
    this.passoAtual = 1;
    document.body.style.overflow = 'hidden';
  }

  fecharQuiz() {
    this.quizAberto = false;
    document.body.style.overflow = '';
  }

  selecionar(campo: string, valor: any) {
    this.quizForm.patchValue({ [campo]: valor });
  }

  incrementar(campo: string) {
    const atual = this.quizForm.get(campo)?.value || 0;
    this.quizForm.patchValue({ [campo]: atual + 1 });
  }

  decrementar(campo: string) {
    const atual = this.quizForm.get(campo)?.value || 0;
    if (atual > 0) this.quizForm.patchValue({ [campo]: atual - 1 });
  }

  incrementarExtra(i: number) {
    const arr = this.quizForm.get('servicosAdicionaisUI') as FormArray;
    const atual = arr.at(i).get('quantidade')?.value || 1;
    arr.at(i).patchValue({ quantidade: atual + 1 });
  }

  decrementarExtra(i: number) {
    const arr = this.quizForm.get('servicosAdicionaisUI') as FormArray;
    const atual = arr.at(i).get('quantidade')?.value || 1;
    if (atual > 1) arr.at(i).patchValue({ quantidade: atual - 1 });
  }

  toggleExtra(i: number) {
    const arr = this.quizForm.get('servicosAdicionaisUI') as FormArray;
    const atual = arr.at(i).get('selecionado')?.value;
    arr.at(i).patchValue({ selecionado: !atual });
  }

  carregarServicosDoAdmin() {
    this.api.getServicosExtras().subscribe({
      next: (servicos) => {
        this.servicosExtras = servicos || [];
        const arr = this.quizForm.get('servicosAdicionaisUI') as FormArray;
        arr.clear();
        this.servicosExtras.forEach(() => {
          arr.push(this.fb.group({ selecionado: [false], quantidade: [1] }));
        });
      },
      error: (err) => {
        console.error('Erro ao carregar serviços extras:', err);
        this.servicosExtras = [];
      }
    });
  }

  proximoPasso() {
    if (this.passoAtual < this.totalPassos) {
      this.passoAtual++;
    } else {
      this.finalizar();
    }
  }

  voltarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  toggleDistancia(event: any) {
    this.sabeDistancia = event.target.value === 'sim';
    if (!this.sabeDistancia) {
      this.quizForm.patchValue({ distanciaQuadroPoste: 0 });
    }
  }

  fecharModal() {
    this.exibirModal = false;
    this.quizAberto = false;
    this.numeroWhatsApp = '';
    document.body.style.overflow = '';
    if (this.resultadoCalculo && this.resultadoCalculo.id) {
      this.router.navigate(['/levantamento'], { queryParams: { orcamentoId: this.resultadoCalculo.id } });
    }
  }

  atualizarNumeroWhatsApp(event: any) {
    this.numeroWhatsApp = event.target.value;
  }

  enviarWhatsApp() {
    if (!this.numeroWhatsApp || !this.resultadoCalculo) return;
    
    const nome = this.quizForm.get('nomeCliente')?.value || 'Cliente';
    const total = ((this.resultadoCalculo.valorTotalMaoDeObra || 0) + (this.resultadoCalculo.custoLogistica || 0)).toFixed(2);
    
    const telefone = this.numeroWhatsApp.replace(/\D/g, ''); // Limpa caracteres não numéricos
    const msg = `Olá! O orçamento elétrico para o projeto "${nome}" ficou no valor estimado de R$ ${total}.\nPara mais detalhes, entre em contato.`;
    
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  finalizar() {
    if (this.quizForm.invalid) {
      alert('Por favor, preencha os campos obrigatórios (Nome e Área).');
      this.passoAtual = 3; // Volta para o passo de dados
      return;
    }

    this.carregando = true;
    const formVal = this.quizForm.value;

    const adicionais = this.servicosExtras
      .map((s, i) => {
        const uiControl = (this.quizForm.get('servicosAdicionaisUI') as FormArray).at(i);
        return {
          nomeServico: s.nome,
          precoUnitario: s.valor,
          quantidade: uiControl.value.quantidade || 0,
          selecionado: uiControl.value.selecionado
        };
      })
      .filter(s => s.selecionado);

    const payload = {
      ...formVal,
      adicionais,
      visitasEstimadas: 1,
      diariaAjudante: 0
    };

    this.api.gerarOrcamento(payload).subscribe({
      next: (resultado) => {
        this.resultadoCalculo = {
          ...resultado,
          valorTotalMaoDeObra: resultado.valorTotalMaoDeObra || 0,
          custoLogistica: resultado.custoLogistica || 0
        };
        this.carregando = false;
        this.exibirModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        console.error('ERRO:', err);
        alert('Erro ao calcular orçamento. Verifique se as APIs estão online.');
      }
    });
  }
}