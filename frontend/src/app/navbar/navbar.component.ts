import { Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  Logout() {
    this.authService.logoutUser();
  }
  ngOnInit(): void {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-out',
      delay: 200,
      once: true,
    });
  }
}
