import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Caminho corrigido

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const userRole = authService.getUserRole(); 
    const requiredRole = route.data['role'];

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