import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { OrdersService } from '../../../../services/orders.service';
import { Evidence, ILineItem, IOrders } from '../../../../models/order.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  faArrowUpFromBracket = faArrowUpFromBracket;

  @Input() orderId!: number;
  @Input() providerId!: number;


  private ordersService = inject(OrdersService);
  private toastr = inject(ToastrService);

  order = signal<IOrders | null>(null);
  items = signal<ILineItem[] | null>(null);
  evidences = signal<Evidence | null>(null);
  file: File | null = null;
  formProvider: FormGroup;
  statuses: string[] = ['pending', 'processing', 'onHold', 'completed', 'cancelled', 'refunded', 'failed', 'trash', 'entregado'];

  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      status: new FormControl(this.order()?.status)
    })
  }

  async ngOnInit() {
    if (this.orderId !== undefined) {
      await new Promise<void>((resolve) => {
        this.ordersService.getOneOrder(this.orderId!).subscribe({
          next: (data) => {
            this.order.set(data);
            this.items.set(data.line_items)
            console.log(data);

            resolve();
          },
          error: (err) => {
            this.toastr.error('Error al cargar la orden')
            resolve();
          }
        });
      });
    };
    this.getEvidence();
  }

  getEvidence() {
    this.ordersService.getEvidence(this.orderId).subscribe({
      next: (data) => {
        this.evidences.set(data)
      }
    })
  }

  uploadEvidence(type: string, event: any) {
    this.file = event.target.files[0];
    this.ordersService.uploadEvidence(this.providerId, this.orderId, type, this.file).subscribe({
      next: (data) => {
        this.toastr.success('Archivo subido correctamente')
      }
    })
  }

  changeOrderStatus(status: string) {
    this.ordersService.changeOrderStatus(this.orderId, status).subscribe({
      next: (data) => { 
        this.toastr.success(`Estado cambiado a ${status}`)
      }
    })
  }

}


