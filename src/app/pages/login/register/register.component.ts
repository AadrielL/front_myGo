import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html', // REMOVIDO o '../' pois o HTML está na mesma pasta
  standalone: false // Se estiver usando AppModule, garanta que standalone seja false
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'VISITANTE';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userData = { name: this.name, email: this.email, password: this.password, role: this.role };
    this.authService.register(userData).subscribe({
      next: () => {
        alert('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => { // ADICIONADO : any para resolver o erro TS7006
        this.errorMessage = 'Erro ao criar conta.';
      }
    });
  }
}