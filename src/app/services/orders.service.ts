import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IOrders } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private http = inject(HttpClient);
  private apiUrl = 'http://ec2-3-138-142-64.us-east-2.compute.amazonaws.com:3001/orders';

  constructor() { }

  getOrders(providerId: number) {
    return this.http.get<IOrders[]>(`${this.apiUrl}/seller/${providerId}`)
  }
}
