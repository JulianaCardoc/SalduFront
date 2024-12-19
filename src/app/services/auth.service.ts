import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'https://fake-trello-api.herokuapp.com'
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.API_URL}/api/v1/auth/login`, {
      email,
      password
    })
    .pipe(
      tap(response => {
        this.tokenService.saveToken(response.access_token);
      })
    )
  }

  logout() {
    this.tokenService.removeToken();
  }
}
