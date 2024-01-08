import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderItemsService {
  private baseUrl = 'http://localhost:3000/orders';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.error('localStorage is not available in this environment');
      return null;
    }
  }
  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  getOrdersByUserId(): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    return this.http.get<any[]>(`${this.baseUrl}/getOrders/user`, httpOptions);
  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getorders`);
  }

  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/details/${orderId}`);
  }

  createOrders(userId: number, orderItems: any[]): Observable<any> {
    const requestBody = {
      userId: userId,
      orderItems: orderItems,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    return this.http.post<any>(
      `${this.baseUrl}/createOrders`,
      requestBody,
      httpOptions
    );
  }

  createOrderItems(orderId: number, orderItems: any[]): Observable<any> {
    const orders = {
      orderId: orderId,
      orderItems: orderItems,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };
    return this.http.post<any>(
      `${this.baseUrl}/createOrderItems`,
      orders,
      httpOptions
    );
  }
}
