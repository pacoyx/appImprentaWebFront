import { Component, OnDestroy, OnInit, Version, ViewChild } from '@angular/core';
import { Servicio } from 'src/app/interfaces/servicio';
import { RegserviciosService } from 'src/app/services/regservicios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { ServicioExcel } from '../../interfaces/servicioExcel';
import { FileService } from 'src/app/services/file.service';
import * as fileSaver from 'file-saver';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-regservicios',
  templateUrl: './regservicios.component.html',
  styleUrls: ['./regservicios.component.css']
})
export class RegserviciosComponent implements OnInit, OnDestroy {

  arrServicios: any[] = [];
  arrVersiones: any[] = [];
  products: any[] = [];
  arrTipoVersion: any[] = ['CREAZIONE', 'REVISIONE', 'FINITO'];
  @ViewChild('modalData') myModal: any;
  @ViewChild('modalVersiones') myModalVersiones: any;
  @ViewChild('modalImport') myModalImport: any;
  form: FormGroup;

  importContacts: ServicioExcel[] = [];
  idServicio = '';

  uiSubscription: Subscription;
  usuarioSis: Usuario;

  constructor(
    private store: Store<AppState>,
    private regservis: RegserviciosService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private excelSrv: ExcelService,
    private dataExtractService: FileService) { }

  ngOnInit(): void {

    this.uiSubscription = this.store.select('usuario').subscribe(resp => {
      this.usuarioSis = resp.user;
    });

    this.form = this.fb.group({
      uploadFile: [null],
      idservicio: [''],
      usuario: [''],
      tipo: [''],
      comentario: [''],
      servicioItem: [''],
    });

    if (this.usuarioSis.profileUser === 'ADMINISTRADOR') {
      this.regservis.getServicios().then((resp: any) => {
        this.arrServicios = resp.data[0];
      });
    }

    if (this.usuarioSis.profileUser === 'DISEÑADOR') {
      this.regservis.getServicios().then((resp: any) => {
        this.arrServicios = resp.data[0];
      });
    }

    if (this.usuarioSis.profileUser === 'CALIDAD') {
      this.regservis.getServicios().then((resp: any) => {
        this.arrServicios = resp.data[0];
      });
    }


  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }


  uploadFile(event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      uploadFile: file
    });
    this.form.get('uploadFile').updateValueAndValidity();
  }

  submitForm(): void {
    this.regservis.addVersion(this.form.value).then(resp => {
      console.log(resp);
    });
  }

  nuevoServicio(): void {
    this.modalService.open(this.myModalImport);
  }

  registrarServicioExcel(): void {

    const current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() + '-' + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + '-' + current_datetime.getDate();
    // console.log(formatted_date)

    let cont = 1;
    this.importContacts.forEach(item => {
      console.log(item);
      const objParam = {
        item,
        cont,
        usuario: 'rita@gmail.com',
        cliente: '10436190455',
        fechaCreacion: formatted_date
      };
      this.regservis.createRegServicio(objParam).then((resp: any) => {
        console.log(resp.estado, resp.error);
      });
      cont++;
    });
  }

  listaVersionxServicio(item: Servicio): void {
    this.idServicio = item.idservicio;
    // console.log(item.idservicio);
    this.regservis.getVersionesxServicio(item.idservicio, item.item).then((resp: any) => {
      this.arrVersiones = resp.data[0];
    });
    this.modalService.open(this.myModalVersiones);
  }

  addVersion(item: Servicio): void {
    this.form.patchValue({
      idservicio: item.idservicio,
      usuario: 'pacoyx@gmail.com',
      comentario: '',
      servicioItem: item.item
    });
    this.modalService.open(this.myModal);
  }

  onFileChange(evt: any): void {
    console.log('entro al excel');

    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // console.log(e.target.result);

      const bstr: string = e.target.result;
      const data = this.excelSrv.importFromFile(bstr) as any[];
      const header: string[] = Object.getOwnPropertyNames(new ServicioExcel());
      const importedData = data.slice(1);
      this.importContacts = importedData.map(arr => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return obj as ServicioExcel;
      });

    };
    reader.readAsBinaryString(target.files[0]);

  }

  descargarFile(filaVersion: any): void {

    console.log(filaVersion.nombreArchivo, filaVersion.mimetype);

    this.dataExtractService
      .download(filaVersion.nombreArchivo)
      .subscribe(response => {

        const blob: any = new Blob([response], { type: filaVersion.mimetype });
        const url = window.URL.createObjectURL(blob);
        // window.open(url);
        // window.location.href = response.url;
        fileSaver.saveAs(blob, filaVersion.nombreArchivoOriginal);
      }, error => {
        console.log('Something went wrong', error);
      });
  }


}
