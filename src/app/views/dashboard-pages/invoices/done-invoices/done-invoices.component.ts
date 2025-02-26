import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

import { Invoice } from '../../../../models/invoice.model';
import { InvoicesService } from '../../../../services/invoices.service';
import { ButtonComponent } from '../../../../shared-components/button/button.component';

@Component({
  selector: 'app-done-invoices',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FontAwesomeModule],
  templateUrl: './done-invoices.component.html',
  styleUrl: './done-invoices.component.css'
})
export class DoneInvoicesComponent {
  faArrowUpFromBracket = faArrowUpFromBracket;

  private invoicesService = inject(InvoicesService);
  private toastr = inject(ToastrService);

  invoices: Invoice[] = [];
  file: File | null = null;

  ngOnInit() {
    this.getDoneInvoices();
  }

  getDoneInvoices() {
    this.invoicesService.getDoneInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        console.log(data);
        
        if (this.invoices.length == 0) {
          this.toastr.error('No se encontraron órdenes');
        }
      },
      error: (error) =>
        this.toastr.error('No se encontraron órdenes')
    })
  }

  uploadEvidence(providerEmail: string, orderId: number, invoiceId: number, event: any) {
    this.file = event.target.files[0];
    this.invoicesService.uploadEvidence(providerEmail, orderId, invoiceId, this.file).subscribe({
      next: (data) => {
        this.toastr.success('Evidencia cargada correctamente')
      }, error: (error) =>  {
        console.error(error),
        this.toastr.error('Error al cargar el archivo') }
    })
  }
}
