import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderItemsService {
  private baseUrl = 'http://localhost:3000/orders';
  private token: string | null = null; // Initialize token as null
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.retrieveToken();
  }

  // Retrieve token from AuthService
  private retrieveToken(): void {
    this.token = this.authService.getToken();
  }
  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  getOrdersByUserId(): Observable<any[]> {
    const httpOptions = this.token
      ? {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          }),
        }
      : {};
    return this.http.get<any[]>(`${this.baseUrl}/getOrders/user`, httpOptions);
  }

  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orderItems/${orderId}`);
  }

  createOrders(userId: number, orderItems: any[]): Observable<any> {
    const requestBody = {
      userId: userId,
      orderItems: orderItems,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };

    return this.http.post<any>(
      `${this.baseUrl}/createOrders`,
      requestBody,
      httpOptions
    );
  }

  createOrderItems(orderId: number, orderItems: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createOrderItems`, {
      orderId: orderId,
      orderItems: orderItems,
    });
  }
}
