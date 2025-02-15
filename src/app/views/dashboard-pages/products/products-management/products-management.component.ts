import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { WooProduct } from '../../../../models/product.model';
import { ProductsService } from '../../../../services/products.service';
import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, ButtonComponent, RouterLink],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css'
})
export class ProductsManagementComponent {
  faMagnifyingGlass = faMagnifyingGlass;

  private productService = inject(ProductsService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);


  users: User[] = [];
  products: WooProduct[] = [];
  formProvider: FormGroup;
  productStatuses: string[] = [];
  filteredProducts: WooProduct[] = [];

  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      selectProvider: ['default'],
      selectStatus: ['default']
    });
  }

  ngOnInit() {
    this.getUser();
    this.formProvider.get('selectProvider')?.valueChanges.subscribe((providerId) => {
      if (providerId) {
        this.getWooProducts(providerId);
      } else {
        this.filteredProducts = [];
      }
    });
    this.formProvider.get('selectStatus')?.valueChanges.subscribe(() => {
      if (this.products.length > 0) {
        this.filterProducts();
      }
    });
  }

  getUser() {
    this.userService.getUsers('vendedor').subscribe({
      next: (data) =>
        this.users = data
    })
  }

  getWooProducts(providerId: number) {
    this.productService.getWooProducts(providerId).subscribe({
      next: (data) => {
        this.products = data.productsData;
        this.filteredProducts = [...this.products];
        this.generateProductStatuses();
        if (data.productsData.length === 0) {
          this.toastr.error('No se encontraron productos')
        }
      },
      error: () => {
        this.toastr.error('Error del servidor');
      }
    })
  }


  generateProductStatuses() {
    const uniqueStatuses = new Set(this.products.map(product => product.status));
    this.productStatuses = Array.from(uniqueStatuses).sort();
  }


  filterProducts() {
    const selectedStatus = this.formProvider.get('selectStatus')?.value;
    if (selectedStatus === 'default') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        product => product.status === selectedStatus
      );
    }
  }

  inactivateProduct(productId: number) {
    this.productService.inactivateProduct(productId).subscribe({
      next: (data) => {
        this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
      }
    })
  }

  activateProduct(productId: number) {
    this.productService.activateProduct(productId).subscribe({
      next: (data) => {
        this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
      }
    })
  }

}
