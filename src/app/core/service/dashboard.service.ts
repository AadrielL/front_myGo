import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8082/api/v1/dashboard'; // Sua porta da Calculadora
    private readonly HISTORICO_URL = 'http://localhost:8081/v1/historico'; // Porta da Calculadora


  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getHistorico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico`);
  }
}