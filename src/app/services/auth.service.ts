import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders()
      .set('content-type', 'application/json')
  };



  loginUsuario(email: string, password: string) {
    const objPost = {
      email, password
    }
    return this.httpClient.post<ResponseApi>(environment.apiRaizBackend + 'login/auth', JSON.stringify(objPost),
      this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }



  httpError(error) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }

}

interface ResponseApi {
  estado: string;
  message: string;
  data: any[];
}
