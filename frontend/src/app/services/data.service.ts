import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Merr tokenin nga AuthService kur inicializohet DataService
    this.token = this.authService.getToken();
  }

  // Metoda për të marrë tokenin nga AuthService
  getToken(): string | null {
    return this.token;
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getUsers`, {});
  }

  deleteUser(id: string): Observable<any> {
    // Krijimi i objektit të header-it vetëm nëse token ekziston
    const httpOptions = this.token
      ? {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          }),
        }
      : {};

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
    newRole: string | null
  ): Observable<any> {
    const authToken = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const data = {
      newName,
      newLastName,
      newEmail,
      newPw,
      newRole,
    };

    return this.http.put<any>(`${this.baseUrl}/updateUser/${userId}`, data, {
      headers,
    });
  }

  getUserById(userId: string): Observable<any> {
    // Adjust the API endpoint as per your backend route for fetching user details
    return this.http.get<any>(`${this.baseUrl}/getUserById/${userId}`);
  }

  //Products
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getProducts`, {});
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/productId/${productId}`);
  }
  deleteProduct(id: string): Observable<any> {
    // Krijimi i objektit të header-it vetëm nëse token ekziston
    const httpOptions = this.token
      ? {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          }),
        }
      : {};

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
    const authToken = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
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
    const authToken = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const data = {
      userId,
      productId,
      quantity,
    };

    return this.http.put<any>(
      `${this.baseUrl}/updateProduct`, // Replace with your actual API endpoint
      data,
      {
        headers,
      }
    );
  }

  createProduct(productData: any): Observable<any> {
    const headers = new HttpHeaders(); // Add headers if needed

    return this.http.post<any>(`${this.baseUrl}/createProduct`, productData, {
      headers,
    });
  }
}
