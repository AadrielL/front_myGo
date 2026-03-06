import { Injectable } from '@angular/core'; // CORREÇÃO: Importado do @angular/core
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://orcamento-db.onrender.com';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('token', res.token);
        if (res.role) localStorage.setItem('userRole', res.role.toUpperCase());
        if (res.name) localStorage.setItem('userName', res.name);
      })
    );
  }

  // Métodos que seu Dashboard e Login precisam:
  getUserName(): string { return localStorage.getItem('userName') || 'Usuário'; }
  getUserRole(): string { return localStorage.getItem('userRole') || 'VISITANTE'; }
  logout(): void { localStorage.clear(); }
  isLoggedIn(): boolean { return !!localStorage.getItem('token'); }
}