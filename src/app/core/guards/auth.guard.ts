import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Caminho corrigido

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const userRole = authService.getUserRole(); 
    const requiredRole = route.data['role'];
    const planType = authService.getPlanType();

    // Bloqueia a navegação para dashboard-main se for FREE
    if (state.url.includes('/dashboard-main') && planType === 'FREE') {
      alert('O Dashboard é exclusivo para assinantes.');
      router.navigate(['/assinatura']);
      return false;
    }

    // Lógica de proteção por Role
    if (requiredRole && userRole !== requiredRole) {
      // Se for um visitante tentando acessar dashboard admin, manda pro quiz
      router.navigate(['/quiz']); 
      return false;
    }
    return true;
  }

  // Se não estiver logado, manda para o login
  router.navigate(['/login']);
  return false;
};