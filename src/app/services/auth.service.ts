import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, throwError } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { take } from 'rxjs/operators';
import { unSetUser } from '../store/actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioTmp: any;
  subscribeAuth: Subscription;

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private router: Router) {

    this.subscribeAuth = this.store.select('usuario').subscribe(resp => {
      this.usuarioTmp = resp.user;
    });

  }

  httpHeader = {
    headers: new HttpHeaders()
      .set('content-type', 'application/json')
  };



  loginUsuario(email: string, password: string) {
    const objPost = {
      email, password
    };
    return this.httpClient.post<ResponseApi>(environment.apiRaizBackend + 'login/auth', JSON.stringify(objPost),
      this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  isAuth(): boolean {
    const user = localStorage.getItem('userImprenta');
    if (user) {
      return true;
    } else {
      return false;
    }

  }

  logout() {
    this.store.dispatch(unSetUser());
    this.subscribeAuth.unsubscribe();
    localStorage.removeItem('userImprenta');
    this.router.navigate(['/login']);
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
