import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  // Verifique se a porta 8883 é a do seu microserviço de materiais
  private apiUrl = 'http://localhost:8082/api/v1/materiais'; 

  constructor(private http: HttpClient) {}

  // Este é o método que o seu LevantamentoComponent.ts está chamando
  gerarLevantamento(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/gerar`, payload);
  }

  // Aproveite e verifique se este método também existe para o Histórico
  getDetalhesMaterial(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/detalhes/${id}`);
  }
}