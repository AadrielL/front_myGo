import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsViewComponent } from './pages/dashboard/reports-view/reports-view.component';
import { LoginComponent } from './pages/login/login.component';
import { QuizComponent } from './pages/dashboard/quiz/quiz.component';
import { HistoricoComponent } from './pages/orcamentos/historico/historico.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // O Dashboard agora é uma página simples e limpa
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // O Relatório agora é uma página DIFERENTE e separada
  { path: 'reports', component: ReportsViewComponent, canActivate: [authGuard], data: { role: 'ADMIN' } },

  { path: 'quiz', component: QuizComponent, canActivate: [authGuard] },
  { path: 'historico', component: HistoricoComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }