import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
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

  toggleEdit(userId: string | undefined): void {
    if (!userId) {
      console.error('Error: userId is undefined');
      return;
    }

    this.selectedUserId = userId;
    this.isEditingUser = true;
    this.dataService.getUserById(userId).subscribe(
      (userData: any) => {
        this.user = userData;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  confirmUpdate(userId: string): void {
    console.log('Selected user ID in confirmUpdate:', userId);

    const currentUser = this.users.find((user) => user.id === userId);

    if (!currentUser) {
      console.error('Error: No user selected');
      return;
    }

    this.updateUser(
      userId,
      currentUser.newName,
      currentUser.newLastName,
      currentUser.newEmail,
      currentUser.newPw,
      currentUser.newRole
    );
    this.isEditingUser = false;
  }

  updateUser(
    userId: string,
    newName: string | null,
    newLastName: string | null,
    newEmail: string | null,
    newPw: string | null,
    newRole: string | null
  ): void {
    this.dataService
      .updateUser(userId, newName, newLastName, newEmail, newPw, newRole)
      .subscribe(
        (updatedUser: any) => {
          console.log('User updated:', updatedUser);
          this.user = updatedUser;
          this.fetchUsers();
          this.showSuccessMessage('User updated successfully');
        },
        (error: any) => {
          console.error('Error updating user:', error);
        }
      );
  }
  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }
}
