import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent {
  title = 'orcamento-front';
  
  // ESSA LINHA RESOLVE O ERRO: define a variável que o HTML está procurando
  isSidebarCollapsed: boolean = false; 

  // Função para receber o evento da sidebar e atualizar o estado
  onToggleSidebar(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}