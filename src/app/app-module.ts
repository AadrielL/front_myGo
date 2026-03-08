import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QuizComponent } from './shared/quiz/quiz.component';
import { LevantamentoComponent } from './pages/levantamento/levantamento.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { ConfigPrecosComponent } from './pages/config-precos/config-precos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent, 
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