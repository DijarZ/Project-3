import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  Logout() {
    this.authService.logoutUser();
  }
}
