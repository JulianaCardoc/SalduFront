import { Component, inject } from '@angular/core';
import { CdkVirtualForOf, ScrollingModule } from '@angular/cdk/scrolling';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { Load, Product, UpdateImageResponse } from '../../../../models/product.model';
import { ProductsService } from '../../../../services/products.service';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ButtonComponent, ScrollingModule, CdkVirtualForOf, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {

  faMagnifyingGlass = faMagnifyingGlass;

  private productService = inject(ProductsService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  
  updateImageResponse!: UpdateImageResponse;
  users: User[] = [];
  products: Product[] = [];
  selectedImage: { [key: string]: string } = {};
  formProvider: FormGroup;
  loads: Load[] = [];


  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      selectProvider: ['default'],
      selectLoad: ['default'],
    });
  }

  ngOnInit() {
    this.getUser();
    this.formProvider.get('selectProvider')?.valueChanges.subscribe((providerId) => {
      if (providerId && providerId !== 'default') {
        this.getLoads(providerId);
      } else {
        this.loads = [];
      }
    });
  }

  getProducts(providerId?: number, uploadStatus?: string, loadId?: string) {
    console.log(loadId);
    
    this.productService.getProducts(providerId, uploadStatus, loadId).subscribe({
      next: (data) => {
        this.products = data;
        console.log(data);
        if(data.length == 0) {
          this.toastr.error('No se encontraron productos')
        }
      },
      error: (error) => {
          this.toastr.error('Seleccione un proveedor')
      }
    })
    if(providerId && providerId > 0) {
      this.getLoads(providerId);
    } else {
        this.toastr.error('Seleccione un proveedor')
    }
  }

  getUser() {
    this.userService.getUsers('vendedor').subscribe({
      next: (data) =>
        this.users = data
    })
  }

  getLoads(providerId: number) {
    if (!providerId) {
      this.loads = [];
      return;
    }
    this.productService.getLoads(providerId).subscribe({
      next: (data) => {
        this.loads = data;
      },
      error: () => {
        this.toastr.error('Error');
      }
    });
  }

  onImageSelect(sku: string, imageUrl: string): void {
    this.selectedImage[sku] = imageUrl;
  }

  saveImage(productId: number, urlImage: string) {
    console.log(productId, urlImage);
    this.productService.saveProductImage(productId.toString(), urlImage).subscribe({
      next: (data) => {
        this.updateImageResponse = data;
        console.log(this.updateImageResponse);
      }
    })
  }
}
