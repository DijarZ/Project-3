// order-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderItemsService } from '../services/order-items.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ShopingcartService } from '../services/shopingcart.service';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss',
})
export class OrderItemsComponent implements OnInit {
  orders: any[] = []; // Array to store fetched orders
  userId: number | undefined;
  orderId: number | null = null;
  orderItems: any[] = [];
  constructor(
    private orderItemsService: OrderItemsService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private shopingCartService: ShopingcartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const orderIdFromParams = +params['orderId']; // Fetch orderId from queryParams and convert to number
      if (!isNaN(orderIdFromParams)) {
        this.orderId = orderIdFromParams;
        this.fetchShoppingCartItems(); // Fetch shopping cart items after getting orderId
      } else {
        console.error('Invalid Order ID in query parameters.');
        // Handle the case where orderId is not a valid number in queryParams
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
            productId: cartItem.productId,
            quantity: quantity,
            totalAmount: totalAmount,
          });
        } else {
          console.error('Invalid price or quantity:', cartItem);
          this.orderItems.push({
            productId: cartItem.productId,
            quantity: isNaN(quantity) ? 1 : quantity,
            totalAmount:
              isNaN(price) || isNaN(quantity)
                ? 0
                : price * (isNaN(quantity) ? 1 : quantity),
          });
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error fetching product details, if needed
      }
    });
  }

  createOrderItems(): void {
    // Retrieve shopping cart items from the shopping cart service
    this.shopingCartService.getCartItems().subscribe(
      (cartItems) => {
        console.log('Order Items:', this.orderItems);

        this.orderId;
        this.orderItemsService
          .createOrderItems(this.orderId!, this.orderItems)
          .subscribe(
            (response) => {
              console.log('Order items created:', response);
            },
            (error) => {
              // Handle error, if needed
              console.error('Error creating order items:', error);
            }
          );
      },
      (error) => {
        // Handle error in fetching shopping cart items, if needed
        console.error('Error fetching shopping cart items:', error);
      }
    );
  }
}
