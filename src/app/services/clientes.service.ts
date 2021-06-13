import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private httpClient: HttpClient) { }


  getClientes() {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const elbody = {};
      return this.httpClient
        .post(environment.apiRaizBackend + 'cliente/listClientes', elbody, { headers })
        .pipe(
          retry(1),
          catchError(this.httpError),
          map((resp: any) => {
            return resp;
          })
        )
        .toPromise()
        .then(
          (resP: any) => {
            resolve(resP);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }


  createClientes(objParam: Cliente) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      return this.httpClient
        .post(environment.apiRaizBackend + 'cliente/createClientes', objParam, { headers })
        .pipe(
          retry(1),
          catchError(this.httpError),
          map((resp: any) => {
            return resp;
          })
        )
        .toPromise()
        .then(
          (resP: any) => {
            resolve(resP);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }


  updateClientes(objParam: Cliente) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      return this.httpClient
        .post(environment.apiRaizBackend + 'cliente/updateClientes', objParam, { headers })
        .pipe(
          retry(1),
          catchError(this.httpError),
          map((resp: any) => {
            return resp;
          })
        )
        .toPromise()
        .then(
          (resP: any) => {
            resolve(resP);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }


  deleteClientes(objParam: Cliente) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      
      return this.httpClient
        .post(environment.apiRaizBackend + 'cliente/deleteClientes', { idcliente: objParam.idcliente }, { headers })
        .pipe(
          retry(1),
          catchError(this.httpError),
          map((resp: any) => {
            return resp;
          })
        )
        .toPromise()
        .then(
          (resP: any) => {
            resolve(resP);
          },
          (err) => {
            reject(err);
          }
        );
    });
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
