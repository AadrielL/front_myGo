import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false // ISSO AQUI É O QUE FALTA PARA O ERRO NG6008 SUMIR
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuário';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || 'Eletricista';
    this.userRole = this.authService.getUserRole() || 'VISITANTE';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaCalculo() {
    this.router.navigate(['/quiz']);
  }

  irParaHistorico() {
    this.router.navigate(['/historico']);
  }
}