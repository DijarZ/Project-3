import { Component, OnInit } from '@angular/core';
import { OrderItemsService } from '../services/order-items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopingcartService } from '../services/shopingcart.service';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss',
})
export class OrderItemsComponent implements OnInit {
  orders: any[] = [];
  userId: number | undefined;
  orderId: number | null = null;
  orderItems: any[] = [];
  constructor(
    private orderItemsService: OrderItemsService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private shopingCartService: ShopingcartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const orderIdFromParams = +params['orderId'];
      if (!isNaN(orderIdFromParams)) {
        this.orderId = orderIdFromParams;
        this.fetchShoppingCartItems();
      } else {
        console.error('Invalid Order ID in query parameters.');
      }
    });
  }

  fetchShoppingCartItems(): void {
    this.shopingCartService.getCartItems().subscribe(
      (cartItems) => {
        this.calculateOrderItems(cartItems);
        console.log('Calcualted Order Items');
      },
      (error) => {
        console.error('Error fetching shopping cart items:', error);
      }
    );
  }

  calculateOrderItems(cartItems: any[]): void {
    this.orderItems = [];

    cartItems.forEach(async (cartItem) => {
      try {
        const productDetails = await this.dataService
          .getProductById(cartItem.productId)
          .toPromise();

        const price = productDetails.price;
        const quantity = parseInt(cartItem.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
          const totalAmount = price * quantity;
          this.orderItems.push({
            product: { id: cartItem.productId, price: price },
            Quantity: quantity,
            totalAmount: totalAmount,
          });
        } else {
          console.error('Invalid price or quantity:', cartItem);
          this.orderItems.push({
            product: { id: cartItem.productId, price: 0 },
            Quantity: isNaN(quantity) ? 1 : quantity,
            totalAmount:
              isNaN(price) || isNaN(quantity)
                ? 0
                : price * (isNaN(quantity) ? 1 : quantity),
          });
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    });
  }

  createOrderItems(): void {
    console.log('OrderId:', this.orderId);
    console.log('OrderItems:', this.orderItems);

    if (
      this.orderId !== null &&
      this.orderItems &&
      this.orderItems.length > 0
    ) {
      console.log('Creating order items...');
      this.orderItemsService
        .createOrderItems(this.orderId!, this.orderItems)
        .subscribe(
          (response) => {
            console.log('Order items created:', response);
            this.showMessage('Order items created successfully!');
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 3000);
          },
          (error) => {
            console.error('Error creating order items:', error);
            console.log(error);
          }
        );
    } else {
      console.error('No orderId or empty orderItems array to create.');
    }
  }
  showMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }
}
