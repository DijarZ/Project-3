import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dashboard-panel-products',
  templateUrl: './dashboard-panel-products.component.html',
  styleUrl: './dashboard-panel-products.component.scss',
})
export class DashboardPanelProductsComponent {
  products: any[] = [];
  selectedProductId: string | undefined;
  isEditingProduct = false;

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  product: any = {
    productId: '',
    productName: '',
    description: '',
    quantity: null,
    price: null,
  };

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
  deleteProduct(id: string): void {
    this.dataService.deleteProduct(id).subscribe(
      (products) => {
        this.products = products;
        console.log('Product deleted:', products);
        this.fetchProducts();
        this.showMessage('Product deleted successfully');
      },
      (error) => {
        console.error('Error deleting user:', error);
        console.log(error);
      }
    );
  }

  toggleEditProduct(productId: string | undefined): void {
    if (!productId) {
      console.error('Error: productId is undefined');
      return;
    }

    this.selectedProductId = productId;
    this.isEditingProduct = true;

    this.dataService.getProductById(productId).subscribe(
      (productData: any) => {
        this.product = productData;
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  confirmUpdateProduct(productId: string): void {
    console.log('Selected product ID in confirmUpdate:', productId);

    const currentProduct = this.products.find(
      (product) => product.id === productId
    );

    if (!currentProduct) {
      console.error('Error: No product selected');
      return;
    }

    this.updateProduct(
      productId,
      currentProduct.productName,
      currentProduct.description,
      currentProduct.quantity,
      currentProduct.price,
      currentProduct.image
    );
  }

  updateProduct(
    productId: string,
    productName: string | null,
    description: string | null,
    quantity: number | null,
    price: number | null,
    image: File
  ): void {
    this.dataService
      .updateProduct(
        productId,
        productName,
        description,
        quantity,
        price,
        image
      )
      .subscribe(
        (updatedProduct: any) => {
          console.log('Product updated:', updatedProduct);
          this.product = updatedProduct;
          this.fetchProducts();
          this.showMessage('Product updated successfully');
          this.isEditingProduct = false;
        },
        (error: any) => {
          console.error('Error updating product:', error);
        }
      );
  }

  showMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'Close', config);
  }

  productName: string = '';
  description: string = '';
  price: number | null = null;
  quantity: number | null = null;
  image: File | null = null;

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

  createNewProduct(): void {
    if (
      !this.productName ||
      !this.description ||
      !this.price ||
      !this.quantity ||
      !this.image
    ) {
      console.error('Please fill in all fields and select an image.');
      this.showMessage('Product cant uplaodig,please fill in al fields');

      return;
    }

    const formData = new FormData();
    formData.append('productName', this.productName);
    formData.append('description', this.description);
    formData.append('price', String(this.price));
    formData.append('quantity', String(this.quantity));
    formData.append('image', this.image);

    this.dataService.createProduct(formData).subscribe(
      (response) => {
        console.log('Product created:', response);
        this.showMessage('Product uploaded successfully');
        this.fetchProducts();
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }
}
