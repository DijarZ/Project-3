import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emptyValues: boolean = false;

  constructor(private authService: AuthService) {}

  login() {
    if (this.email.length !== 0 && this.password.length !== 0) {
      this.emptyValues = false;
      const userData = { email: this.email, password: this.password };

      this.authService.loginUser(userData).subscribe(
        (response: any) => {
          const token = response.token;
          this.authService.storeToken(token); // Storing the token in localStorage

          // Log to check if the token is retrieved and stored properly
          console.log('Token received:', token);

          // Attempt to get the user role after storing the token
          const userRole = this.authService.getUserRole();
          console.log('User Role:', userRole);

          // Redirect based on user role
          this.authService.redirectBasedOnRole();
        },
        (error: any) => {
          console.error('Error during login:', error);
        }
      );
    }
  }
}
