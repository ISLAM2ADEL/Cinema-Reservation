import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:3000/api/v1/chatbot'; 

  sendMessage(userMessage: string): Observable<any> {
    return this.http.post(this.apiUrl, { message: userMessage });
  }
}