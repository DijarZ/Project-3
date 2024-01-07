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

  private token: string | null = null;

  getToken(): string | null {
    return this.token;
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
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
      return of([]); // Return an empty observable or handle error accordingly
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
