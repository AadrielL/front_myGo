import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly API = 'http://localhost:8082/api/materiais';

  constructor(private http: HttpClient, private authService: AuthService) {}

  gerarLevantamento(dados: any): Observable<any> {
    // Pegamos o tenantId do eletricista logado para isolar os dados
    const tenantId = this.authService.getTenantId() || 'default';
    const headers = new HttpHeaders().set('X-Tenant-ID', tenantId);
    
    return this.http.post(`${this.API}/gerar`, dados, { headers });
  }
}