import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service'; // Import corrigido

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
      // CORREÇÃO: A rota correta é 'dashboard-main', que é filha do DashboardComponent
      this.router.navigate(['/dashboard-main']);
      },
      error: (err: any) => {
        console.error('Erro no Login:', err);
      // Se der 403, a senha/email está errado ou o Java ainda não atualizou no Render
        this.errorMessage = err.status === 403 ? 'E-mail ou senha inválidos.' : 'Erro ao conectar ao servidor.';
      }
    });
  }
}