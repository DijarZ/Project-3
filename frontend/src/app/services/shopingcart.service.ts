import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { log } from 'console';
@Injectable({
  providedIn: 'root',
})
export class ShopingcartService {
  private baseUrl = 'http://localhost:3000/shopingcart';

  private tokenKey = 'auth_token';

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.error('localStorage is not available in this environment');

      return null;
    }
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.tokenKey;
  }

  addProductToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Observable<any> {
    const body = { userId, productId, quantity };
    return this.http.post<any>(`${this.baseUrl}/cart/add`, body);
  }

  getCartByUserId(): Observable<any[]> {
    const userId = this.authService.getUserIdFromToken();
    console.log(userId);

    if (!userId) {
      console.error('User ID not found in token');
      return of([]);
    }

    return this.http.get<any[]>(`${this.baseUrl}/cart/user/${userId}`);
  }

  removeProductByProductId(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cart/remove/product/${id}`);
  }
  removeProductsByUserId(): Observable<any> {
    const userId = this.authService.getUserIdFromToken();

    return this.http.delete<any>(`${this.baseUrl}/cart/remove/user/${userId}`);
  }
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getCart`);
  }
  updateCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/update/cart/quantity`);
  }
}
