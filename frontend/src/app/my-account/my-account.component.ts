import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrderItemsService } from '../services/order-items.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent implements OnInit {
  userId: string | null = null;
  userData: any = {};
  orderId: string | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private orderItemsService: OrderItemsService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken();

    if (this.userId) {
      this.dataService.getUserById(this.userId).subscribe(
        (data) => {
          this.userData = data;
          console.log('User data:', this.userData);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.error('User ID not found in token');
    }

    if (this.orderId) {
      this.orderItemsService.getOrderItems(Number(this.orderId)).subscribe(
        (orderItems) => {
          console.log('Order Items:', orderItems);
        },
        (error) => {
          console.error('Error fetching order items:', error);
        }
      );
    }
  }

  confirmUpdate(): void {
    if (!this.userId || !this.userData) {
      console.error('User ID or user data is missing');
      return;
    }

    this.dataService
      .updateUser(
        this.userId,
        this.userData.newName,
        this.userData.newLastName,
        this.userData.newEmail,
        this.userData.newPw,
        this.userData.newRole,
        this.userData.newCity,
        this.userData.newStreet,
        this.userData.newCountry
      )
      .subscribe(
        (updatedUser: any) => {
          console.log('User updated:', updatedUser);
          this.userData = updatedUser;
          this.showSuccessMessage('User updated successfully');
        },
        (error: any) => {
          console.error('Error updating user:', error);
        }
      );
  }

  deleteUser(): void {
    if (!this.userId) {
      console.error('User ID is missing');
      return;
    }

    this.dataService.deleteUser(this.userId).subscribe(
      (users) => {
        console.log('User deleted:', users);
        this.showSuccessMessage('User deleted successfully');
        this.authService.logoutUser();
      },
      (error) => {
        console.error('Error deleting user:', error);
        console.log(error);
      }
    );
  }

  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }
}
