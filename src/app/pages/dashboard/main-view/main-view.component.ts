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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole().toUpperCase();
    this.userName = this.authService.getUserName();
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}