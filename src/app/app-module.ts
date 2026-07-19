import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importado Interceptor
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module'; 
import { AppComponent } from './app.component';

// Interceptor
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Verifique se o caminho está correto

// Componentes
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainViewComponent } from './pages/dashboard/main-view/main-view.component';
import { ReportsViewComponent } from './pages/dashboard/reports-view/reports-view.component';
import { SidebarComponent } from './pages/layout/sidebar/sidebar.component';
import { QuizComponent } from './pages/dashboard/quiz/quiz.component';
import { LevantamentoComponent } from './pages/levantamento/levantamento.component';
import { HistoricoComponent } from './pages/orcamentos/historico/historico.component';
import { ConfigPrecosComponent } from './pages/config-precos/config-precos.component';

import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Onboarding } from './pages/onboarding/onboarding';
import { AssinaturaComponent } from './pages/assinatura/assinatura';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MainViewComponent,
    ReportsViewComponent,
    SidebarComponent,
    QuizComponent,
    LevantamentoComponent,
    HistoricoComponent,
    ConfigPrecosComponent,
    Onboarding,
    AssinaturaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BaseChartDirective 
  ],
  providers: [
    DatePipe,
    provideCharts(withDefaultRegisterables()),
    // REGISTRO DO INTERCEPTOR AQUI:
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }