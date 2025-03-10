import { Component, inject, Input, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import { WooProduct } from '../../../../models/product.model';
import { ProductsService } from '../../../../services/products.service';
import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { ToggleButtonComponent } from '../../../../shared-components/toggle-button/toggle-button.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, ToggleButtonComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  faBoxesStacked = faBoxesStacked;

  @Input() productId!: number;
  @Input() providerId!: number;

  private productService = inject(ProductsService);
  private toastr = inject(ToastrService);

  product = signal<WooProduct | null>(null);
  isPublished = signal<boolean>(false);
  productForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    stock_quantity: new FormControl(0),
    description: new FormControl(''),
    price: new FormControl(0),
    dpto: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl('')
  });

  async ngOnInit() {
    await this.getWooProduct();
  }

  async getWooProduct() {
    if (this.providerId !== undefined && this.productId !== undefined) {
      await new Promise<void>((resolve) => {
        this.productService.getOneWooProduct(this.providerId, this.productId).subscribe({
          next: (data) => {
            console.log(data);
            
            this.product.set(data);
            this.isPublished.set(data.status == 'publish');
            this.productForm.patchValue({
              name: data.name ?? '',
              stock_quantity: data.stock_quantity ?? 0,
              description: data.description ?? '',
              price: data.price ?? 0
            });
            resolve();
          },
          error: (err) => {
            this.toastr.error('Error al cargar el producto')
            resolve();
          }
        });
      });
    }
  }
  
  get productStatusLabel(): string {
    return this.isPublished() ? 'Activo' : 'Inactivo';
  }

  async toggleStatus() {
    if (this.isPublished()) {
      this.productService.inactivateProduct(this.productId).subscribe({
        next: () => {
          this.isPublished.set(false);
          this.product.set({ ...this.product()!, status: 'draft' });
          this.toastr.success('Producto inactivado correctamente');
        },
        error: () => {
          this.toastr.error('Error al inactivar el producto');
        }
      });
    } else {
      this.productService.activateProduct(this.productId).subscribe({
        next: () => {
          this.isPublished.set(true);
          this.product.set({ ...this.product()!, status: 'publish' });
          this.toastr.success('Producto activado correctamente');
        },
        error: () => {
          this.toastr.error('Error al activar el producto');
        }
      });
    }
  }

  updateWooProduct() {
    const payload = this.productForm.getRawValue();
    console.log(payload);
    this.productService.updateWooProduct(this.productId, payload).subscribe({
      next: (data) => {
        this.toastr.success('Producto actualizado correctamente')
      }, error: (error) => {
        this.toastr.error('Error al actualizar el producto')
      }
    })
  }
  

}
