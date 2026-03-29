import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
    standalone: false
})
export class MainViewComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Pegamos o papel do usuário e convertemos para maiúsculo para evitar erros no *ngIf
    const role = this.authService.getUserRole();
    this.userRole = role ? role.toUpperCase() : 'USER';
    
    // Pegamos o nome ou definimos um fallback caso venha vazio
    this.userName = this.authService.getUserName() || 'Usuário';
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}