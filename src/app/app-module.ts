import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';

// Componentes de Autenticação
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';

// Componentes do Dashboard e Layout
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainViewComponent } from './pages/dashboard/main-view/main-view.component';
import { ReportsViewComponent } from './pages/dashboard/reports-view/reports-view.component';
import { SidebarComponent } from './pages/layout/sidebar/sidebar.component';
import { QuizComponent } from './pages/dashboard/quiz/quiz.component';
import { LevantamentoComponent } from './pages/levantamento/levantamento.component';
import { HistoricoComponent } from './pages/orcamentos/historico/historico.component';
import { ConfigPrecosComponent } from './pages/config-precos/config-precos.component';

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
    ConfigPrecosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }