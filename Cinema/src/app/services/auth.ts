import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http=inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  register(userData:any):Observable<any>{
  return this.http.post(`${this.apiUrl}/register`,userData);
  }

   login(userData:any):Observable<any>{
  return this.http.post(`${this.apiUrl}/login`,userData);
  }
}

