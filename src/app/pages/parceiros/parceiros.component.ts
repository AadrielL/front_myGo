import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface ParceiroEletricista {
  id: string;
  nome: string;
  tenantId: string;
  regiao: string;
  avaliacao: number;
  totalAvaliacoes: number;
  especialidades: string[];
  inicianteDestaque: boolean;
  tempoResposta: string;
  fotoUrl?: string;
  seloNbr: boolean;
}

@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.css'],
  standalone: false
})
export class ParceirosComponent implements OnInit {
  filtroRegiao: string = 'TODAS';
  carregando: boolean = false;

  regioesDisponiveis: string[] = [
    'TODAS',
    'Plano Diretor Sul',
    'Plano Diretor Norte',
    'Taquaralto e Região Sul',
    'Jardim Aureny e Região'
  ];

  // Sem mock — lista vem exclusivamente do banco de dados
  listaParceiros: ParceiroEletricista[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarParceirosApi();
  }

  carregarParceirosApi(): void {
    this.carregando = true;
    const apiUrl = 'https://api.comandosamoris.tech/auth/parceiros-destaque';
    this.http.get<ParceiroEletricista[]>(apiUrl).subscribe({
      next: (dados) => {
        this.listaParceiros = dados && dados.length > 0 ? dados : [];
        this.carregando = false;
      },
      error: () => {
        this.listaParceiros = [];
        this.carregando = false;
      }
    });
  }

  get parceirosFiltrados(): ParceiroEletricista[] {
    let lista = this.listaParceiros;
    if (this.filtroRegiao !== 'TODAS') {
      lista = lista.filter(p => p.regiao === this.filtroRegiao);
    }
    // Algoritmo Anti-Panelinha: Prioriza iniciantes bem avaliados (nota >= 4.5)
    return [...lista].sort((a, b) => {
      if (a.inicianteDestaque && !b.inicianteDestaque) return -1;
      if (!a.inicianteDestaque && b.inicianteDestaque) return 1;
      return b.avaliacao - a.avaliacao;
    });
  }

  selecionarEletricista(eletricista: ParceiroEletricista): void {
    localStorage.setItem('tenant_eletricista', eletricista.tenantId);
    localStorage.setItem('nome_eletricista', eletricista.nome);
    localStorage.setItem('regiao_eletricista', eletricista.regiao);
    this.router.navigate(['/quiz']);
  }

  voltarHome(): void {
    this.router.navigate(['/onboarding']);
  }
}
