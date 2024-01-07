import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ShopingcartService } from '../services/shopingcart.service';
import { AuthService } from '../services/auth.service';
import { OrderItemsService } from '../services/order-items.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: any[] = [];
  selectedProductId: string | undefined;
  selectedUserId: string | undefined;
  currentUser: { userId: string } = { userId: '' };
  token: string | null | undefined;
  cartData: any[] = [];
  showCart: boolean = false;
  userId!: number;
  orderItems: any[] = [];
  orderId: any;
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private shopingcartService: ShopingcartService,
    private authService: AuthService,
    private orderItemsServie: OrderItemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();

    //get userId from token to addproduct on shopingcart
    const userId = this.authService.getUserIdFromToken();
    console.log('User ID:', userId);

    if (userId) {
      this.currentUser.userId = userId;
      console.log('User ID:', this.currentUser.userId);
      this.fetchProducts();
    } else {
      console.error('User ID not found in token');
    }
  }

  product: any = {
    productId: '',
  };

  getCurrentProduct(productId: string | undefined): void {
    if (!productId) {
      console.error('Error: productId is undefined');
      return;
    }

    this.selectedProductId = productId;

    this.dataService.getProductById(productId).subscribe(
      (productData: any) => {
        this.product = productData;
        console.log('selected product ID', productId);
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
        console.log(error);
      }
    );
  }
  fetchProducts(): void {
    this.dataService.getProducts().subscribe(
      (products) => {
        this.products = products; // Assign products data to component variable
        this.ImagePaths(); // Method to adjust image paths

        console.log('Products:', products);
        // Process products data here
      },
      (error) => {
        console.error('Error fetching products:', error);
        console.log(error);
      }
    );
  }
  ImagePaths(): void {
    const baseUrl = 'http://localhost:3000/images/';

    this.products.forEach((product) => {
      // Check if the image path is an absolute URL (starts with 'http')
      if (!product.image.startsWith('http')) {
        // If it's not an absolute URL, prepend the base URL
        product.image = baseUrl + product.image;
      }
    });
  }

  showMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Set the duration for the snackbar
    this.snackBar.open(message, 'Close', config);
  }

  addToCart(quantity: number, productId: string): void {
    if (!this.currentUser.userId) {
      console.error('User ID is invalid or not found');
      return;
    }
    // Add logic to add the product to the cart using the ShopingcartService
    this.shopingcartService
      .addProductToCart(this.currentUser.userId, productId, quantity)
      .subscribe(
        (response) => {
          // Handle success, if needed
          console.log('Product added to cart:', response);
          this.showMessage('Porduct added succesfully on cart');
          this.getCart;
        },
        (error) => {
          // Handle error, if needed
          console.error('Error adding product to cart:', error);
          console.log(error);
        }
      );
  }

  getCart(): void {
    if (!this.showCart) {
      this.cartData = [true]; // Reset cartData before fetching cart data
      this.showCart = false; // Hide cart until data is fetched

      this.shopingcartService.getCartByUserId().subscribe(
        (data) => {
          this.cartData = data;
          this.showCart = true; // Set showCart to true when cart data is fetched
          console.log('Cart Data:', this.cartData);
        },
        (error) => {
          console.error('Error fetching cart data:', error);
        }
      );
    } else {
      this.showCart = false; // Hide cart when the button is clicked again
    }
  }

  removeProductFromCart(id: number): void {
    this.shopingcartService.removeProductByProductId(id).subscribe(
      (removedProduct) => {
        console.log('Product removed from cart:', removedProduct);
        this.getCart();
        this.showMessage('Product deleted successfully');
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
          }, 2000);
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

  // createOrderItems(orderId: number, orderItems: any[]): void {
  //   this.orderItemsServie.createOrderItems(orderId, orderItems).subscribe(
  //     (response: any) => {
  //       console.log('Order items created:', response);
  //       // Handle success (if needed)
  //     },
  //     (error: any) => {
  //       console.error('Error creating order items:', error);
  //       // Handle error scenario
  //     }
  //   );
  // }
}
