import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { faMagnifyingGlass, faChevronRight, faChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { WooProduct, WooProductResponse } from '../../../../models/product.model';
import { ProductsService } from '../../../../services/products.service';
import { ToggleButtonComponent } from '../../../../shared-components/toggle-button/toggle-button.component';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterLink, ToggleButtonComponent, FormsModule],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css'
})
export class ProductsManagementComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faPenToSquare = faPenToSquare;


  private productService = inject(ProductsService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  users: User[] = [];
  products = signal<WooProduct[]>([]);
  filteredProducts = signal<WooProduct[]>([]);
  productResponse: WooProductResponse | null = null;
  formProvider: FormGroup;
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalItems = signal(0);
  status = signal('published');
  pageNumber = signal(1);

  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      selectProvider: new FormControl(''),
      searchText: new FormControl(''),
      selectStatus: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getUsersFilter();
  }

  getUsersFilter() {
    this.userService.getUsersFilter('vendedor').subscribe({
      next: (data) => this.users = data
    });
  }

  getWooProducts() {
    const provider = this.formProvider.value.selectProvider;
    if (provider) {
      this.productService.getWooProducts(provider).subscribe({
        next: (data) => {
          this.products.set(data.productsData);
          this.applyFilters();
        },
        error: () => {
          this.toastr.error('Error del servidor');
        }
      });
    }
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
        this.applyFilters();
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

  applyFilters() {
    let filtered = this.products();
    const search = this.formProvider.value.searchText?.toLowerCase() || '';
    const status = this.formProvider.value.selectStatus;

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.id.toString().includes(search) ||
        p.sku.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    this.totalItems.set(filtered.length);
    this.currentPage.set(1);
    this.filteredProducts.set(filtered.slice(0, this.itemsPerPage()));
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    const start = (page - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    this.filteredProducts.set(this.products().slice(start, end));
  }

  changeStatus(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.formProvider.patchValue({ status: value });
    this.applyFilters();
  }

  changeItemsPerPage(value: number) {
    this.itemsPerPage.set(value);
    this.applyFilters();
  }

  pageNumbers(): number[] {
    const totalPages = this.totalPages();
    let pages: number[] = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const current = this.currentPage();
      pages.push(1);
      if (current > 3) pages.push(-1);
      let start = Math.max(2, current - 1);
      let end = Math.min(totalPages - 1, current + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (current < totalPages - 2) pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  }

  totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

}
