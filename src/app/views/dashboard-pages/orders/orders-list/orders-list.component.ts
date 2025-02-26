import { Component, inject, signal } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { OrdersService } from '../../../../services/orders.service';
import { IOrders } from '../../../../models/order.model';
import { ButtonComponent } from '../../../../shared-components/button/button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [FontAwesomeModule, ButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent {
  faMagnifyingGlass = faMagnifyingGlass;

  private userService = inject(UserService);
  private orderService = inject(OrdersService)
  private toastr = inject(ToastrService);

  users: User[] = [];
  orders = signal<IOrders[]>([]);
  formProvider: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formProvider = this.fb.group({
      selectProvider: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers('vendedor').subscribe({
      next: (data) => this.users = data
    });
  }

  getOrders() {
    const provider = this.formProvider.value.selectProvider;
    console.log('provider', provider);
    if(provider) {
      this.orderService.getOrders(provider).subscribe({
        next: (data) => this.orders.set(data)
      })
    }
  }
}
