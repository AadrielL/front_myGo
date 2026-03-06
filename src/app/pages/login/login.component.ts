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
    // CORREÇÃO: Passando como um objeto único {}
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        // O token já é salvo pelo AuthService via tap()
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Erro no Login:', err);
        this.errorMessage = err.status === 403 ? 'E-mail ou senha inválidos.' : 'Erro ao conectar ao servidor.';
      }
    });
  }
}