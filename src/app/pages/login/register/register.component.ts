import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class RegisterComponent {
  // Campos vinculados ao ngModel do formulário
  nome: string = '';
  email: string = '';
  password: string = '';
  
  // Mensagem de feedback para o usuário
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  /**
   * Executa o registro do novo usuário no ecossistema MyGo.
   * Por padrão, todo novo registro via frontend é atribuído à role VISITANTE.
   */
  onRegister(): void {
    this.errorMessage = ''; // Limpa erros anteriores

    // Objeto formatado para o DTO do seu Backend Java
    const userData = { 
      nome: this.nome, 
      email: this.email, 
      password: this.password,
      role: 'VISITANTE' // Hardcoded por segurança em um SaaS
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro realizado:', response);
        alert('⚡ Conta MyGo criada com sucesso! Você já pode fazer login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        this.errorMessage = this.handleError(err);
      }
    });
  }

  private handleError(err: any): string {
    if (err.status === 400) return 'Este e-mail já está cadastrado ou dados inválidos.';
    if (err.status === 0) return 'Não foi possível conectar ao servidor de autenticação.';
    return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
  }
}