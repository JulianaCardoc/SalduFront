import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string) {
    setCookie('token', token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = getCookie('token');
    return token;
  }

  removeToken() {
    removeCookie('token')
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
