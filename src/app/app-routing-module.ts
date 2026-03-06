  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';

  // Imports dos Componentes
  import { DashboardComponent } from './pages/dashboard/dashboard.component';
  import { LoginComponent } from './pages/login/login.component';
  import { RegisterComponent } from './pages/login/register/register.component';
  import { QuizComponent } from './shared/quiz/quiz.component';

  // Import do Guard
  import { authGuard } from './core/guards/auth.guard';

  const routes: Routes = [
    // Rota inicial: Se não estiver logado, o Guard mandará para o Login
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    // Rotas Públicas
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Rotas Protegidas (Precisa estar logado)
    { 
      path: 'dashboard', 
      component: DashboardComponent, 
      canActivate: [authGuard] 
    },
    { 
      path: 'quiz', 
      component: QuizComponent, 
      canActivate: [authGuard] 
    },
    
    // Rota de fallback (Redireciona qualquer erro para o dashboard)
    { path: '**', redirectTo: '/dashboard' }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }