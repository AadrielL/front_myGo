import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  planType: string = 'FREE';
  isCollapsed: boolean = false;
  isMobile: boolean = false;
  showMobileMenu: boolean = false;
  isNavHidden: boolean = false;

  private lastScrollY: number = 0;

  @Output() collapseChanged = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()?.toUpperCase() || 'USER';
    this.planType = this.authService.getPlanType();
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isMobile) return;
    const currentY = window.scrollY;
    // Esconde ao rolar para baixo (conteúdo sobe), mostra ao rolar para cima
    if (currentY > this.lastScrollY + 8) {
      this.isNavHidden = true;
    } else if (currentY < this.lastScrollY - 8) {
      this.isNavHidden = false;
    }
    this.lastScrollY = currentY;
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showMobileMenu = false;
      this.isNavHidden = false;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
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
