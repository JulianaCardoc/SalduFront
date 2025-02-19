import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { faMagnifyingGlass, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { WooProduct, WooProductResponse } from '../../../../models/product.model';
import { ProductsService } from '../../../../services/products.service';
import { ToggleButtonComponent } from '../../../../shared-components/toggle-button/toggle-button.component';
import { FilterPipe } from '../../../../../utils/pipes/filter.pipe';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterLink, ToggleButtonComponent, FilterPipe, FormsModule],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css'
})
export class ProductsManagementComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  private productService = inject(ProductsService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  users: User[] = [];
  products = signal<WooProduct[]>([]);
  formProvider: FormGroup;
  productStatuses: string[] = [];
  filteredProducts = signal<WooProduct[]>([]);
  productResponse: WooProductResponse | null = null;
  pageNumber: number = 1;
  limit: number = 10;

  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      selectProvider: ['default'],
      selectStatus: ['default'],
      searchText: [''],
    });
  }

  ngOnInit() {
    this.getUsersFilter();
    this.formProvider.get('selectProvider')?.valueChanges.subscribe((providerId) => {
      if (providerId && providerId !== 'default') {
        this.getWooProducts(1, 10, providerId);
      } else {
        this.filteredProducts.set([]);
      }
    });
    this.formProvider.get('selectStatus')?.valueChanges.subscribe(() => {
      if (this.products().length > 0) {
        this.filterProducts();
      }
    });
    this.formProvider.get('searchText')?.valueChanges.subscribe(() => {
      if (this.products().length > 0) {
        this.filterProducts();
      }
    });

  }

  getUsersFilter() {
    this.userService.getUsersFilter('vendedor').subscribe({
      next: (data) => this.users = data
    });
  }

  getWooProducts(page: number = 1, limit: number = 10, providerId: number = 0) {    
    this.productService.getWooProducts(page, limit, providerId).subscribe({
      next: (data) => {
        this.productResponse = data;
        this.products.set(data.productsData);
        this.filteredProducts.set([...this.products()]);
        this.generateProductStatuses();
        if (data.productsData.length === 0) {
          this.toastr.error('No se encontraron productos');
        }
      },
      error: () => {
        this.toastr.error('Error del servidor');
      }
    });
  }

  generateProductStatuses() {
    const uniqueStatuses = new Set(
      this.products().map(product =>
        product.status === 'publish' ? 'Activo' :
          product.status === 'draft' ? 'Inactivo' : product.status
      )
    );
    this.productStatuses = Array.from(uniqueStatuses).sort();
  }

  toggleStatus(productId: number) {
    const product = this.filteredProducts().find(product => product.id === productId);
    if (!product) return;

    const updateStatus = product.status === 'publish' ? 'draft' : 'publish';
    const serviceCall = product.status === 'publish'
      ? this.productService.inactivateProduct(productId)
      : this.productService.activateProduct(productId);

    serviceCall.subscribe({
      next: () => {
        this.products.set(
          this.products().map(p =>
            p.id === productId ? { ...p, status: updateStatus } : p
          )
        );
        this.filterProducts();
        this.toastr.success(
          updateStatus === 'publish' ? 'Producto activado' : 'Producto inactivado'
        );
      },
      error: () => {
        this.toastr.error(
          updateStatus === 'publish' ? 'Error al activar' : 'Error al inactivar'
        );
      }
    });
  }

  filterProducts() {
    const selectedStatus = this.formProvider.get('selectStatus')?.value;
    let filtered = [...this.products()];
    if (selectedStatus !== 'default') {
      filtered = filtered.filter(product => {
        const productStatus = product.status === 'publish' ? 'Activo' :
          product.status === 'draft' ? 'Inactivo' : product.status;
        return productStatus === selectedStatus;
      });
    }
    if (this.formProvider.get('searchText')?.value && this.formProvider.get('searchText')?.value.trim() !== '') {      
      filtered = new FilterPipe().transform(filtered, this.formProvider.get('searchText')?.value);
    }
    this.filteredProducts.set(filtered);
  }
  
  pageNumbers() {
    if (!this.productResponse?.totalPages) return [];
    const totalPages = this.productResponse.totalPages;
    const currentPage = this.pageNumber;
    const maxVisiblePages = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) {
      pages.push(-1);
    }
    return pages;
  }

  onPageChange(pageNo: number) {
    this.pageNumber = pageNo;
    this.getWooProducts(pageNo, this.limit, this.formProvider.get('selectProvider')?.value)
  }


}
