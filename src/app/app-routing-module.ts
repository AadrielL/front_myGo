import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainViewComponent } from './pages/dashboard/main-view/main-view.component';
import { ReportsViewComponent } from './pages/dashboard/reports-view/reports-view.component';
import { QuizComponent } from './pages/dashboard/quiz/quiz.component';
import { HistoricoComponent } from './pages/orcamentos/historico/historico.component';
import { LevantamentoComponent } from './pages/levantamento/levantamento.component';
import { ConfigPrecosComponent } from './pages/config-precos/config-precos.component';

import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard-main', component: MainViewComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'historico', component: HistoricoComponent },
      { path: 'levantamento', component: LevantamentoComponent, data: { role: 'ADMIN' } },
      { path: 'reports', component: ReportsViewComponent, data: { role: 'ADMIN' } },
      { path: 'config-precos', component: ConfigPrecosComponent, data: { role: 'ADMIN' } }
    ]
  },
  { path: '**', redirectTo: 'dashboard-main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }