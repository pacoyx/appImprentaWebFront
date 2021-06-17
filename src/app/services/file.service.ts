import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }


  download(fileName: any) {

    const objParam = {
      fileName
    };
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.http.post(environment.apiRaizBackend + 'version/descargarArchivo', objParam,
      { responseType: 'arraybuffer' });
  }

}
