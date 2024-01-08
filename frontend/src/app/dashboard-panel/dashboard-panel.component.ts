import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UsersComponent } from './users/users.component';
import { DashboardPanelProductsComponent } from '../dashboard-panel-products/dashboard-panel-products.component';
@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrl: './dashboard-panel.component.scss',
})
export class DashboardPanelComponent implements OnInit {
  users: any[] = [];
  products: any[] = [];
  selectedUserId: string | undefined;
  selectedProductId: string | undefined;
  isEditingUser = false;
  isEditingProduct = false;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.dataService.getUsers().subscribe(
      (users) => {
        this.users = users;
        console.log('Users:', users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: string): void {
    this.dataService.deleteUser(id).subscribe(
      (users) => {
        this.users = users;
        console.log('User deleted:', users);
        this.fetchUsers();
        this.showSuccessMessage('User deleted successfully');
      },
      (error) => {
        console.error('Error deleting user:', error);
        console.log(error);
      }
    );
  }

  user: any = {
    userId: '',
    newName: '',
    newLastName: '',
    newEmail: '',
  };

  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }
}
