import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false
})
export class RegisterComponent {
  nome: string = '';
  email: string = '';
  password: string = '';
  tipoPerfil: string = 'ELETRICISTA'; // ELETRICISTA ou CLIENTE

  // Controle da Etapa de Verificação de Código de E-mail
  etapaVerificacao: boolean = false;
  codigoVerificacao: string = '';
  loading: boolean = false;

  errorMessage: string = '';
  sucessoMensagem: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.sucessoMensagem = '';

    if (!this.nome || !this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'A senha deve ter no mínimo 8 caracteres (com maiúscula, minúscula e número).';
      return;
    }

    this.loading = true;

    const userData = { 
      nome: this.nome, 
      email: this.email, 
      password: this.password,
      tipoPerfil: this.tipoPerfil
    };

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.etapaVerificacao = true;
        this.sucessoMensagem = 'Código de verificação enviado! Verifique sua caixa de entrada.';
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no registro:', err);
        this.errorMessage = this.handleError(err);
      }
    });
  }

  onVerificarCodigo(): void {
    if (!this.codigoVerificacao || this.codigoVerificacao.trim().length !== 6) {
      this.errorMessage = 'Por favor, digite o código de 6 dígitos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verificarCodigo(this.email, this.codigoVerificacao.trim()).subscribe({
      next: (response: any) => {
        this.loading = false;
        alert('⚡ Conta ativada com sucesso! Bem-vindo ao ecossistema AMORIS Tech.');
        this.router.navigate(['/dashboard-main']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro na validação do código:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Código incorreto ou expirado. Solicite um novo código.';
        }
      }
    });
  }

  onReenviarCodigo(): void {
    this.loading = true;
    this.errorMessage = '';
    this.sucessoMensagem = '';

    this.authService.reenviarCodigo(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.sucessoMensagem = 'Novo código enviado para o seu e-mail!';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Não foi possível reenviar o código agora. Tente em instantes.';
      }
    });
  }

  private handleError(err: any): string {
    if (err.error && typeof err.error === 'string') return err.error;
    if (err.status === 400) return 'Dados inválidos ou e-mail já cadastrado.';
    if (err.status === 0) return 'Não foi possível conectar ao servidor.';
    return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
  }
}
