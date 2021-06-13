import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private httpClient: HttpClient) { }

  getAreas() {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const elbody = {};
      return this.httpClient
        .post(environment.apiRaizBackend + 'area/listAreas', elbody, { headers })
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
