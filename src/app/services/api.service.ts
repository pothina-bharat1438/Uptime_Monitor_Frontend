import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private refresh = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  getEndpoints(): Observable<any> {
    return this.http.get(`${this.baseUrl}/endpoints`);
  }

  addEndpoint(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/endpoints`, data);
  }

  deleteEndpoint(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/endpoints/${id}`);
  }

  endpointHistory(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/endpoints/history/${id}`);
  }

  refreshEndpoints() {
    this.refresh.next();
  }

  onRefresh(): Observable<void> {
    return this.refresh.asObservable();
  }
}
