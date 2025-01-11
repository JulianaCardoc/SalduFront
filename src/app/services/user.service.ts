import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://ec2-3-144-209-131.us-east-2.compute.amazonaws.com:3001/users';

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
  ) { }

  getUsers(role?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    let params = new HttpParams();
    if (role !== undefined) {
      params = params.append('role', role);
    }
    return this.http.get<User[]>(this.apiUrl, { headers, params });
  }
}