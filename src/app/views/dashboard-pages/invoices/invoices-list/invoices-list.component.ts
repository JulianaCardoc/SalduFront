import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
// import { NgxPaginationModule } from 'ngx-pagination';


import { Invoice } from '../../../../models/invoice.model';
import { InvoicesService } from '../../../../services/invoices.service';
import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, ReactiveFormsModule, FormsModule, CommonModule, ButtonComponent],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css'
})
export class InvoicesListComponent {
  private invoicesService = inject(InvoicesService);
  private toastr = inject(ToastrService);

  invoices: Invoice[] = [];
  faPenToSquare = faPenToSquare;
  selectAll = false;
  // pageSize = 10;
  // currentPage = 1;
  // items = this.getInvoices(this.currentPage - 1, this.pageSize); // Adjust for 0-based indexing

  // pageChange(event: PageChangedEvent) {
  //   this.currentPage = event.page;
  //   this.items = this.getInvoices(this.currentPage - 1, this.pageSize);
  // }
  

  ngOnInit() {
    this.getInvoices();
    console.log(this.invoices);
    
    // if(this.invoices.length <= 0) {
    //   this.toastr.error('No se encontraron facturas')
    // }
  }

  getInvoices() {
    this.invoicesService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
      },
      error: (error) => {
        this.toastr.error('No se encontraron órdenes pendientes')
      }
    });
  }

  toggleSelectAll() {
    this.invoices.forEach((invoice) => (invoice.checkbox = this.selectAll));
  }

  checkboxChanged() {
    if (this.checkboxesSelected()) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  checkboxesSelected() {
    return this.invoices.every((invoice) => invoice.checkbox);
  }

  submit() {
    if (this.selectedCheckboxes.length == 0) {
      console.log('Empty selection');
    } else {
      for (const invoice of this.selectedCheckboxes) {
        this.invoicesService.uploadToSiigo(invoice.id).subscribe({
          next: (data) => {

          }
        })
      }
    }
  }

  get selectedCheckboxes() {
    return this.invoices.filter((invoice) => invoice.checkbox);
  }
}
