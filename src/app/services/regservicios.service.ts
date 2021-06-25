import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ServicioExcel } from '../interfaces/servicioExcel';


@Injectable({
  providedIn: 'root'
})
export class RegserviciosService {

  constructor(private httpClient: HttpClient) { }




  getServicios(profile: string, filtro) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const elbody = { tipo: profile, filtro };
      return this.httpClient
        .post(environment.apiRaizBackend + 'servicio/listServicio', elbody, { headers })
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

  createRegServicio(objParam: any): Promise<any> {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const elbody = {
        idservicio: objParam.item.refOrdine,
        fechaCreacion: objParam.fechaCreacion,
        idusuario: objParam.usuario,
        idcliente: objParam.cliente,
        codigoArticuloVenta: objParam.item.refArticoloVendita,
        codigoArticuloGrafico: objParam.item.codArticoloMaterialeGrafico,
        tipo: objParam.item.AttivitaRichiesta,
        descripcion: objParam.item.DescrizioneArticolo,
        fechaEntregaProveedor: objParam.item.DataRichiestaMaterialeFornitore,
        fechaEntregaVenta: objParam.item.DataScadRichiestaFileGrafico,
        estado: 'ACTIVO',
        item: objParam.cont,
      };
      return this.httpClient
        .post(environment.apiRaizBackend + 'servicio/createServicio', elbody, { headers })
        .pipe(
          // retry(1),
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

  getVersionesxServicio(idservicio: string, item: number) {

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const elbody = { idservicio, item };
      return this.httpClient
        .post(environment.apiRaizBackend + 'version/listarVersionServicio', elbody, { headers })
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

  addVersionWithFile(objData: any) {



    return new Promise((resolve, reject) => {

      const formData: any = new FormData();
      formData.append('uploadFile', objData.uploadFile);
      formData.append('idservicio', objData.idservicio);
      formData.append('usuario', objData.usuario);
      formData.append('tipo', objData.tipo);
      formData.append('comentario', objData.comentario);
      formData.append('servicioItem', objData.servicioItem);



      return this.httpClient
        .post(environment.apiRaizBackend + 'version/registrarVersion', formData)
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

  addVersionWithOutFile(objData: any) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {

      const elbody = {
        idservicio: objData.idservicio,
        usuario: objData.usuario,
        tipo: objData.tipo,
        comentario: objData.comentario,
        servicioItem: objData.servicioItem
      };

      return this.httpClient
        .post(environment.apiRaizBackend + 'version/registrarVersionNoFile', elbody, { headers })
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
