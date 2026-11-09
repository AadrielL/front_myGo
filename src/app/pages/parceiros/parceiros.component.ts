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

  // Base inicial com algoritmo de distribuição equitativa (Palmas / TO)
  listaParceiros: ParceiroEletricista[] = [
    {
      id: 'elet-01',
      nome: 'Carlos Eduardo Siqueira',
      tenantId: 'tenant-carlos-104-sul',
      regiao: 'Plano Diretor Sul',
      avaliacao: 4.9,
      totalAvaliacoes: 8,
      especialidades: ['Instalações Residenciais', 'Quadro QDF', 'Norma NBR 5410'],
      inicianteDestaque: true,
      tempoResposta: '< 15 min',
      seloNbr: true
    },
    {
      id: 'elet-02',
      nome: 'Marcos Vinicius Ribeiro',
      tenantId: 'tenant-marcos-taquaralto',
      regiao: 'Taquaralto e Região Sul',
      avaliacao: 4.8,
      totalAvaliacoes: 6,
      especialidades: ['Padrão Energisa', 'Chuveiro & Aquecedores', 'Rede Bifásica'],
      inicianteDestaque: true,
      tempoResposta: '< 20 min',
      seloNbr: true
    },
    {
      id: 'elet-03',
      nome: 'Renato Alves da Costa',
      tenantId: 'tenant-renato-norte',
      regiao: 'Plano Diretor Norte',
      avaliacao: 5.0,
      totalAvaliacoes: 11,
      especialidades: ['Projetos Elétricos', 'Manutenção Comercial', 'LED & Iluminação'],
      inicianteDestaque: false,
      tempoResposta: '< 10 min',
      seloNbr: true
    },
    {
      id: 'elet-04',
      nome: 'Lucas Gabriel Pinheiro',
      tenantId: 'tenant-lucas-aureny',
      regiao: 'Jardim Aureny e Região',
      avaliacao: 4.7,
      totalAvaliacoes: 5,
      especialidades: ['Aterramento SPDA', 'Tomadas TUG/TUE', 'Reforma Elétrica'],
      inicianteDestaque: true,
      tempoResposta: '< 30 min',
      seloNbr: true
    }
  ];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarParceirosApi();
  }

  carregarParceirosApi(): void {
    // Tenta buscar da API Auth se estiver online, senão usa a base inteligente local
    this.http.get<any[]>('http://localhost:8083/auth/parceiros-destaque').subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          this.listaParceiros = dados;
        }
      },
      error: () => {
        // Modo resiliente local
      }
    });
  }

  get parceirosFiltrados(): ParceiroEletricista[] {
    let lista = this.listaParceiros;
    if (this.filtroRegiao !== 'TODAS') {
      lista = lista.filter(p => p.regiao === this.filtroRegiao);
    }
    // Algoritmo Anti-Panelinha: Prioriza Iniciantes Bem Avaliados (nota >= 4.5)
    return [...lista].sort((a, b) => {
      if (a.inicianteDestaque && !b.inicianteDestaque) return -1;
      if (!a.inicianteDestaque && b.inicianteDestaque) return 1;
      return b.avaliacao - a.avaliacao;
    });
  }

  selecionarEletricista(eletricista: ParceiroEletricista): void {
    // Vincula o tenant_id daquele eletricista na sessão do cliente
    localStorage.setItem('tenant_eletricista', eletricista.tenantId);
    localStorage.setItem('nome_eletricista', eletricista.nome);
    localStorage.setItem('regiao_eletricista', eletricista.regiao);

    // Redireciona para o Quiz de Levantamento NBR 5410 com o vínculo garantido
    this.router.navigate(['/quiz']);
  }

  voltarHome(): void {
    this.router.navigate(['/onboarding']);
  }
}
