import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:3000';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.tokenKey;
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.error('localStorage is not available in this environment');

      return null;
    }
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getUsers`, {});
  }

  deleteUser(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    return this.http.delete<any>(
      `${this.baseUrl}/deleteUser/${id}`,
      httpOptions
    );
  }

  updateUser(
    userId: string,
    newName: string | null,
    newLastName: string | null,
    newEmail: string | null,
    newPw: string | null,
    newRole: string | null,
    newCity: string | null,
    newStreet: string | null,
    newCountry: string | null
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    const data = {
      newName,
      newLastName,
      newEmail,
      newPw,
      newRole,
      newCity,
      newStreet,
      newCountry,
    };

    return this.http.put<any>(`${this.baseUrl}/updateUser/${userId}`, data, {
      headers,
    });
  }

  getUserById(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getUserById/${userId}`);
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getProducts`, {});
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/productId/${productId}`);
  }
  getProductsByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getProducts/ByName/${name}`);
  }
  deleteProduct(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };

    return this.http.delete<any>(
      `${this.baseUrl}/deleteProduct/${id}`,
      httpOptions
    );
  }
  updateProduct(
    productId: string,
    productName: string | null,
    description: string | null,
    quantity: number | null,
    price: number | null,
    imageFile: File
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    const data = {
      productName,
      description,
      quantity,
      price,
      imageFile,
    };

    return this.http.put<any>(
      `${this.baseUrl}/updateProduct/${productId}`,
      data,
      {
        headers,
      }
    );
  }

  updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    const data = {
      userId,
      productId,
      quantity,
    };

    return this.http.put<any>(`${this.baseUrl}/updateProduct`, data, {
      headers,
    });
  }

  createProduct(productData: any): Observable<any> {
    const headers = new HttpHeaders();

    return this.http.post<any>(`${this.baseUrl}/createProduct`, productData, {
      headers,
    });
  }
}
