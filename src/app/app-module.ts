import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';

// Importe seus componentes aqui
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QuizComponent } from './shared/quiz/quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent, 
    QuizComponent      
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule // Isso resolve o erro de 'animations' da foto image_3e07ec.png
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }