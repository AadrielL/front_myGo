import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
    standalone: false
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  isCollapsed: boolean = false;
  
  @Output() collapseChanged = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Pega o cargo do usuário para exibir menus específicos (ADMIN/USER)
    this.userRole = this.authService.getUserRole()?.toUpperCase() || 'USER';
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChanged.emit(this.isCollapsed);
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}