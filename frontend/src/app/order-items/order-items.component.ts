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
    // Reset orderItems array before populating it again
    this.orderItems = [];

    // Loop through each cart item
    cartItems.forEach(async (cartItem) => {
      try {
        // Fetch product details using the product ID from the cartItem
        const productDetails = await this.dataService
          .getProductById(cartItem.productId)
          .toPromise();

        // Extract price and quantity
        const price = productDetails.price;
        const quantity = parseInt(cartItem.quantity);

        // Check if price and quantity are valid numbers
        if (!isNaN(price) && !isNaN(quantity)) {
          const totalAmount = price * quantity;
          // Push order item to the orderItems array with required properties
          this.orderItems.push({
            product: { id: cartItem.productId, price: price }, // This structure should match what the backend expects
            Quantity: quantity,
            totalAmount: totalAmount,
          });
        } else {
          console.error('Invalid price or quantity:', cartItem);
          // Push default values to orderItems array in case of invalid price or quantity
          this.orderItems.push({
            product: { id: cartItem.productId, price: 0 }, // Provide a default price if needed
            Quantity: isNaN(quantity) ? 1 : quantity,
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
}
