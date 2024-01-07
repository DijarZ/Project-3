import { Component } from '@angular/core';
import { ShopingcartService } from '../services/shopingcart.service';
import { OrderItemsService } from '../services/order-items.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-shopingcart',
  templateUrl: './shopingcart.component.html',
  styleUrl: './shopingcart.component.scss',
})
export class ShopingcartComponent {
  cartData: any[] = [];
  showCart: boolean = false;
  userId!: number;
  orderItems: any[] = [];
  orderId: any;

  constructor(
    private shopingcartService: ShopingcartService,
    private orderItemsServie: OrderItemsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getCart(): void {
    if (!this.showCart) {
      this.cartData = [];
      this.showCart = false;

      this.shopingcartService.getCartByUserId().subscribe(
        (data) => {
          this.cartData = data;

          this.showCart = true;
          console.log('Cart Data:', this.cartData);
        },
        (error) => {
          console.error('Error fetching cart data:', error);
        }
      );
    } else {
      this.showCart = false;
    }
  }

  removeProductFromCart(id: number): void {
    this.shopingcartService.removeProductByProductId(id).subscribe(
      (removedProduct) => {
        console.log('Product removed from cart:', removedProduct);
        this.getCart();
        this.showMessage('Product deleted successfully');
        this.updateCart;
        this.cartData;
      },
      (error) => {
        console.error('Error removing product from cart:', error);
        console.log(error);
      }
    );
  }

  Checkout(userId: number, orderItems: any[]): void {
    this.orderItemsServie.createOrders(userId, orderItems).subscribe(
      (response) => {
        if (response && response.orderId) {
          // Change this to response.orderId
          const orderId = response.orderId;
          console.log('Order created with ID:', orderId);
          setTimeout(() => {
            this.router.navigate(['/order-items'], {
              queryParams: { orderId },
            });
          }, 3000);
          this.showMessage('Succesfully');
        } else {
          console.error('Invalid response structure. Order ID not found.');
        }
      },
      (error) => {
        console.error(
          'Error processing checkout your token is expired or any other problem',
          error
        );
        // Handle error scenario
      }
    );
  }

  showMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Set the duration for the snackbar
    this.snackBar.open(message, 'Close', config);
  }

  // Increment quantity of a product in the cart
  decrementQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  incrementQuantity(product: any) {
    product.quantity++;
  }

  updateCart(): void {
    this.shopingcartService.updateCart().subscribe(
      (updatedProduct: any) => {
        console.log('Cart updated with:', updatedProduct);
        this.getCart(); // Refresh cart data after update
      },
      (error: any) => {
        console.error('Error updating cart:', error);
        // Handle error scenario
      }
    );
  }

  // Calculate total price of items in the cart
  getTotalPrice(): number {
    let totalPrice = 0;
    this.cartData.forEach((product) => {
      if (product.product && product.product.price && product.quantity) {
        totalPrice += product.product.price * product.quantity;
      }
    });
    return totalPrice;
  }
}
