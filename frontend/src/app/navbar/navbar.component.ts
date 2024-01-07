import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  searchQuery: string = '';
  constructor(private dataService: DataService) {}

  searchProducts(): void {
    if (this.searchQuery.trim() !== '') {
      this.dataService.getProductsByName(this.searchQuery).subscribe(
        (data: any) => {
          // Handle the fetched products data here
          console.log('Fetched Products:', data);
          // You can emit an event or store the data for further processing
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
}
