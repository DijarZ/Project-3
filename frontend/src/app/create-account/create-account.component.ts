import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  showSuccessModal: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  createAccount() {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService.registerUser(userData).subscribe(
      (response: any) => {
        alert(
          'User created successfully! You will be redirected to the login page.'
        );
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 3000);
      },

      (error: any) => {
        console.error('Registration error:', error);
        this.toastr.error('User creation failed!', 'Error');
        this.showSuccessModal = false;
      }
    );
  }
}
