import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/service/api.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  standalone: false 
})
export class QuizComponent implements OnInit {
  quizForm!: FormGroup;
  passoAtual: number = 1; 
  sabeDistancia: boolean = false;
  servicosExtras: any[] = [];
  carregando: boolean = false;

  // Controle do Modal
  exibirModal: boolean = false;
  resultadoCalculo: any = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private api: ApiService,
    private cdr: ChangeDetectorRef // Adicionado para forçar atualização da tela
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
        console.error("Erro ao carregar serviços extras:", err);
        this.servicosExtras = []; 
      }
    });
  }

  proximoPasso() {
    const totalPassos = this.servicosExtras.length > 0 ? 3 : 2;
    if (this.passoAtual < totalPassos) {
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
    if (this.resultadoCalculo && this.resultadoCalculo.id) {
      this.router.navigate(['/levantamento'], { queryParams: { orcamentoId: this.resultadoCalculo.id } });
    }
  }

  finalizar() {
    if (this.quizForm.invalid) {
      alert("Por favor, preencha os campos obrigatórios.");
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
        console.log("Sucesso! Resultado:", resultado);
        // Salvamos o resultado garantindo que os números não sejam undefined
        this.resultadoCalculo = {
          ...resultado,
          valorTotalMaoDeObra: resultado.valorTotalMaoDeObra || 0,
          custoLogistica: resultado.custoLogistica || 0
        };
        
        this.carregando = false;
        this.exibirModal = true;
        
        // Força o Angular a renderizar o modal com os dados novos
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        console.error("ERRO:", err);
        alert("Erro ao calcular orçamento.");
      }
    });
  }
}