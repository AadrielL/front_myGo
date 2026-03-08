import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { QuizComponent } from './shared/quiz/quiz.component';
import { LevantamentoComponent } from './pages/levantamento/levantamento.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { ConfigPrecosComponent } from './pages/config-precos/config-precos.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ROTAS DE ADMIN (Protegidas por Login e Role)
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard], 
    data: { role: 'ADMIN' } // O Guard agora checa isso
  },
  { 
    path: 'config-precos', 
    component: ConfigPrecosComponent, 
    canActivate: [authGuard], 
    data: { role: 'ADMIN' } 
  },

  // ROTAS COMUNS (Acessíveis por Visitantes e Admin)
  { path: 'quiz', component: QuizComponent, canActivate: [authGuard] },
  { path: 'levantamento', component: LevantamentoComponent, canActivate: [authGuard] },
  { path: 'historico', component: HistoricoComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }