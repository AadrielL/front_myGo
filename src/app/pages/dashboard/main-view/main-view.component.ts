import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  standalone: false // Padrão para o seu AppModule
})
export class MainViewComponent implements OnInit { // Verifique se tem o 'export' aqui!
  userRole: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.userRole = role ? role.toUpperCase().trim() : 'USER';
  }

  irPara(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}