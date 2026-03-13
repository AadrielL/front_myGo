import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/service/api.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'], // Faltava essa linha
  standalone: false 
})
export class QuizComponent implements OnInit {
  quizForm!: FormGroup;
  sabeDistancia: boolean = false;
  servicosExtras: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      nomeCliente: ['', Validators.required],
      metragemM2: [0, [Validators.required, Validators.min(1)]],
      comInfra: [false],
      distanciaQuadroPoste: [0],
      qtdArCondicionado: [0],
      qtdChuveiro: [0],
      qtdCameras: [0],
      qtdMotorPortao: [0],
      // Mudei para bater com o seu HTML (servicosAdicionaisUI)
      servicosAdicionaisUI: this.fb.array([]) 
    });

    this.carregarServicosDoAdmin();
  }

  carregarServicosDoAdmin() {
    this.api.getServicosExtras().subscribe(servicos => {
      this.servicosExtras = servicos;
      const arr = this.quizForm.get('servicosAdicionaisUI') as FormArray;
      servicos.forEach(() => {
        arr.push(this.fb.group({ selecionado: [false], quantidade: [1] }));
      });
    });
  }

  // Mudei o nome para bater com o seu HTML (toggleDistancia)
  toggleDistancia(event: any) {
    const val = event.target.value;
    this.sabeDistancia = val === 'sim';
    if (!this.sabeDistancia) {
      this.quizForm.patchValue({ distanciaQuadroPoste: 0 });
    }
  }

  proximo() {
    if (this.quizForm.valid) {
      const formVal = this.quizForm.value;
      const selecionados = this.servicosExtras
        .filter((s, i) => formVal.servicosAdicionaisUI[i].selecionado)
        .map((s, i) => ({
          nomeServico: s.nome,
          precoUnitario: s.preco,
          quantidade: formVal.servicosAdicionaisUI[i].quantidade
        }));

      // Cria o payload limpando o array da UI e colocando os selecionados
      const payload = { ...formVal, adicionais: selecionados };
      delete payload.servicosAdicionaisUI;

      localStorage.setItem('payload_quiz', JSON.stringify(payload));
      this.router.navigate(['/levantamento']);
    }
  }
}