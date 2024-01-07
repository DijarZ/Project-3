import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UsersComponent } from './users/users.component';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrl: './dashboard-panel.component.scss',
})
export class DashboardPanelComponent implements OnInit {
  editProduct(_t52: any) {
    throw new Error('Method not implemented.');
  }

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
        this.users = users; // Assign users data to component variable
        console.log('Users:', users); // Process users data here
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
        this.fetchUsers(); //to refersh automaticlly page to delete user
        this.showSuccessMessage('User deleted successfully');
      },
      (error) => {
        console.error('Error deleting user:', error);
        console.log(error);
        // You can define error handling logic like displaying a notification
      }
    );
  }

  // Define a user object to hold user data
  user: any = {
    userId: '',
    newName: '',
    newLastName: '',
    newEmail: '',
  };

  // Function to toggle edit mode and fetch user details by ID
  // toggleEdit(userId: string | undefined): void {
  //   if (!userId) {
  //     console.error('Error: userId is undefined');
  //     return;
  //   }

  //   this.selectedUserId = userId;
  //   this.isEditingUser = true;
  //   this.dataService.getUserById(userId).subscribe(
  //     (userData: any) => {
  //       this.user = userData; // Assign user details directly
  //     },
  //     (error: any) => {
  //       console.error('Error fetching user details:', error);
  //       // Handle error (e.g., display a notification or perform specific action)
  //     }
  //   );
  // }

  // // Function to confirm user update
  // confirmUpdate(userId: string): void {
  //   console.log('Selected user ID in confirmUpdate:', userId);

  //   const currentUser = this.users.find((user) => user.id === userId);

  //   if (!currentUser) {
  //     console.error('Error: No user selected');
  //     return;
  //   }

  //   this.updateUser(
  //     userId,
  //     currentUser.newName,
  //     currentUser.newLastName,
  //     currentUser.newEmail
  //   );
  //   this.isEditingUser = false;
  // }

  // // Function to update user details
  // updateUser(
  //   userId: string,
  //   newName: string | null,
  //   newLastName: string | null,
  //   newEmail: string | null,
  //   newPw:string | null
  // ): void {
  //   this.dataService
  //     .updateUser(userId, newName, newLastName, newEmail,newPw)
  //     .subscribe(
  //       (updatedUser: any) => {
  //         console.log('User updated:', updatedUser);
  //         this.user = updatedUser;
  //         this.fetchUsers();
  //         this.showSuccessMessage('User updated successfully');
  //       },
  //       (error: any) => {
  //         console.error('Error updating user:', error);
  //         // Handle error if user update fails (e.g., display error message or perform specific action)
  //       }
  //     );
  // }
  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Set the duration for the snackbar
    this.snackBar.open(message, 'Close', config);
  }
}
