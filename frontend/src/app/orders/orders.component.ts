import { Component } from '@angular/core';
import { OrderItemsService } from '../services/order-items.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders: any[] = [];
  userId!: number;
  orderItems: any[] = [];
  orderId: number | undefined;

  constructor(private orderItemsService: OrderItemsService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderItemsService.getOrders().subscribe(
      (data: any[]) => {
        this.orders = data;
        console.log('Orders:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  fetchOrderItems(): void {
    if (!this.orderId) {
      console.error('Order ID is required');
      return;
    }

    this.orderItemsService.getOrderItems(this.orderId).subscribe(
      (data: any[]) => {
        this.orderItems = data;
        console.log('Fetched Order Items:', this.orderItems);
      },
      (error) => {
        console.error('Error fetching order items:', error);
        console.log(error);
      }
    );
  }
}
