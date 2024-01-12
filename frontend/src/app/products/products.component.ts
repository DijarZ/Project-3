import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ShopingcartService } from '../services/shopingcart.service';
import { AuthService } from '../services/auth.service';
import { OrderItemsService } from '../services/order-items.service';
import { Router } from '@angular/router';
import { error } from 'console';
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
  fetchedProducts: any[] = [];
  searchQuery: string = '';
  originalProducts: any[] = [];
  isSearchMode: boolean | undefined;
  allProducts: any[] = [];

  //Pagination
  currentPage = 1;
  pageSize = 12;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private shopingcartService: ShopingcartService,
    private authService: AuthService,
    private orderItemsServie: OrderItemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');

    this.fetchProducts();
    this.originalProducts = this.products.slice();
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
        this.products = products;
        this.ImagePaths();

        console.log('Products:', products);
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
      if (!product.image.startsWith('http')) {
        product.image = baseUrl + product.image;
      }
    });
  }

  showMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }

  addToCart(quantity: number, productId: string): void {
    if (!this.currentUser.userId) {
      console.error('User ID is invalid or not found');
      return;
    }
    this.shopingcartService
      .addProductToCart(this.currentUser.userId, productId, quantity)
      .subscribe(
        (response) => {
          console.log('Product added to cart:', response);
          this.showMessage('Porduct added succesfully on cart');
          this.getCart;
        },
        (error) => {
          console.error('Error adding product to cart:', error);
          console.log(error);
        }
      );
  }

  getCart(): void {
    if (!this.showCart) {
      this.cartData = [true];
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
      },
      (error) => {
        console.error('Error removing product from cart:', error);
        console.log(error);
      }
    );
  }

  getDisplayedProducts(): any[] {
    return this.searchQuery ? this.fetchedProducts : this.products;
  }

  onClick(): void {
    if (this.searchQuery.trim() !== '') {
      this.fetchedProducts = this.products.filter((product) =>
        product.productName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
      this.isSearchMode = true;
    } else {
      this.fetchedProducts = [];
      this.isSearchMode = false;
    }
  }

  searchProductsByName(name: string): void {
    this.dataService.getProductsByName(name).subscribe(
      (fetchedProducts) => {
        this.fetchedProducts = fetchedProducts;
        this.products = this.combineProducts();
      },
      (error) => {
        console.error('Error fetching searched products:', error);
        console.log(error);
      }
    );
  }

  combineProducts(): any[] {
    this.allProducts = [...this.originalProducts, ...this.fetchedProducts];
    return this.allProducts;
  }
}
