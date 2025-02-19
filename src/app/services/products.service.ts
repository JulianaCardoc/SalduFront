import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Load, Product, UploadResponse, WooProduct, WooProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);
  private apiUrl = 'http://ec2-3-138-142-64.us-east-2.compute.amazonaws.com:3001/upload-product';
  private apiUrlWooProds = 'http://ec2-3-138-142-64.us-east-2.compute.amazonaws.com:3001/products';
  

  constructor() { }

  fileUpload(providerId: number, file: File | null) {
    const formData = new FormData();
    formData.append('providerId', providerId.toString());
    if(file) {
      formData.append('file', file)
    };
    return this.http.post<UploadResponse>(`${this.apiUrl}/massive-upload/${providerId}`, formData);
  }

  downloadRejected(rejectedProducts: any) {
    return this.http.post(`${this.apiUrl}/massive-upload/rejected`, rejectedProducts, { responseType: 'blob'} );
  }

  getProducts(providerId?: number, uploadStatus?: string, loadId?: string) {
    let params = new HttpParams();
    if (providerId !== undefined) {
      params = params.append('providerId', providerId.toString());
    }
    if (uploadStatus) {
      params = params.append('uploadStatus', uploadStatus);
    }   
    if (loadId) {
      params = params.append('loadId', loadId);
    }  
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  saveProductImage(productId: string, urlImage: string) {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, { imagesUrl: urlImage });
  }

  downloadProductsCsv(providerId: number, uploadStatus: string) {
    return this.http.get(`${this.apiUrl}/${providerId.toString()}/${uploadStatus}/csv`, { responseType: 'blob'});
  }

  getLoads(providerId: number) {
    return this.http.get<Load[]>(`${this.apiUrl}/loads/${providerId}`)
  }

  uploadImageS3(providerId: number, productId: number, file: File | null) {
    const formData = new FormData();
    if(file) {
      formData.append('file', file)
    };
    return this.http.post<{url: string}>(`${this.apiUrl}/s3-upload/${providerId}/${productId}`, formData);
  }

  getWooProducts(page: number, limit: number, providerId: number) {    
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('providerId', providerId.toString())    
    return this.http.get<WooProductResponse>(`${this.apiUrlWooProds}/user`, { params })
  }

  inactivateProduct(productId: number) {
    return this.http.patch(`${this.apiUrlWooProds}/delete/${productId}`, {})
  }

  activateProduct(productId: number) {
    return this.http.patch(`${this.apiUrlWooProds}/activate/${productId}`, {})
  }

  getOneWooProduct(providerId: number, productId: number) {
    return this.http.get<WooProduct>(`${this.apiUrlWooProds}/${providerId}/${productId}`)
  }

  updateWooProduct(productId: number, payload: WooProduct) {
    return this.http.patch<WooProduct>(`${this.apiUrlWooProds}/update/${productId}`, payload)
  }

}
