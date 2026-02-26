import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAll(filters: any = {}, page: number = 1): Observable<any> {
    let params = new HttpParams().set('page', page);

    if (filters.name) params = params.set('name', filters.name);
    if (filters.fifa_version) params = params.set('fifa_version', filters.fifa_version);
    if (filters.nationality) params = params.set('nationality', filters.nationality);
    if (filters.club) params = params.set('club', filters.club);
    if (filters.position) params = params.set('position', filters.position);

    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  exportPlayers(filters: any = {}): Observable<Blob> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.fifa_version) params = params.set('fifa_version', filters.fifa_version);
    if (filters.nationality) params = params.set('nationality', filters.nationality);
    if (filters.club) params = params.set('club', filters.club);
    if (filters.position) params = params.set('position', filters.position);

    return this.http.get(`${this.apiUrl}/export`, {
      headers: this.getHeaders(),
      params,
      responseType: 'blob'
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updatePlayer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  createPlayer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, { headers: this.getHeaders() });
  }

  getSkillTimeline(id: number, skills: string[]): Observable<any> {
    const skillsParam = skills.join(',');
    return this.http.get(`${this.apiUrl}/${id}/skills/timeline`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('skills', skillsParam)
    });
  }
}
