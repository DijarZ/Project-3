import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private tokenKey = 'auth_token';
  currentUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  loginUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      console.error('localStorage is not available in this environment');

      return null;
    }
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        const userId = decodedToken?.id || null;
        return userId;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        console.log('Decoded Token:', decodedToken);

        const userRole = decodedToken?.role || null;
        return userRole;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  redirectBasedOnRole() {
    const userRole = this.getUserRole();
    if (userRole === 'admin') {
      this.router.navigate(['/dashboard-panel/dashboard-panel-products']);
    } else if (userRole === 'customer') {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logoutUser() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
    this.currentUser = null;
  }
}
