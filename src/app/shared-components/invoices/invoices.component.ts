import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Invoice } from '../../models/invoice.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  imports: [FontAwesomeModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  standalone: true,
})
export class InvoicesComponent {
  faPenToSquare = faPenToSquare;
  selectAll = false;

  invoices: Invoice[] = [
    {
      id: 1243671414,
      taxedPrice: 12314525,
      checkbox: false,
    },
    {
      id: 1243144714,
      taxedPrice: 12314525,
      checkbox: false,
    },
    {
      id: 1243135414,
      taxedPrice: 12314525,
      checkbox: false,
    },
    {
      id: 1243148414,
      taxedPrice: 12314525,
      checkbox: false,
    },
  ]

  toggleSelectAll() {
    this.invoices.forEach((invoice) => (invoice.checkbox = this.selectAll));
  }

  checkboxChanged() {
    if(this.checkboxesSelected()) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  checkboxesSelected() {
    return this.invoices.every((invoice) => invoice.checkbox);
  }

  submit() {
    let selectedCheckboxes = this.selectedCheckboxes;
    console.log(selectedCheckboxes);
    
  }

  get selectedCheckboxes() {
    return this.invoices.filter((invoice) => invoice.checkbox);
  }
}
