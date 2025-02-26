import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Evidence, IOrders } from '../models/order.model';

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

  getOneOrder(orderId: number) {
    return this.http.get<IOrders>(`${this.apiUrl}/${orderId}`)
  }

  getEvidence(orderId: number) {
    return this.http.get<Evidence>(`${this.apiUrl}/evidence/${orderId}`)
  }

  uploadEvidence(providerId: number, orderId: number, type: string, file: File | null) {
    const formData = new FormData();
    if(file) {
      formData.append('file', file)
    }
    return this.http.post(`${this.apiUrl}/s3-evidence/${providerId}/${orderId}/${type}`, formData)
  }

  changeOrderStatus(orderId: number, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}`, {status})
  }
}
