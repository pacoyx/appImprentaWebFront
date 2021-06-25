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
  formExcel: FormGroup;

  importContacts: ServicioExcel[] = [];
  idServicio = '';

  uiSubscription: Subscription;
  usuarioSis: Usuario;
  bolCargandoServis = false;
  chkFiltro = false;

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

    // formulario para registrar las versiones
    this.form = this.fb.group({
      uploadFile: [null],
      idservicio: [''],
      usuario: [this.usuarioSis.email],
      tipo: [''],
      comentario: [''],
      servicioItem: [''],
    });

    // formulario para cargar el excel
    this.formExcel = this.fb.group({
      usuario: [this.usuarioSis.email, Validators.required],
      cliente: ['', Validators.required]
    });

    // metodo para cargar los servicio por el tipo de perfil
    this.cargarServicios();

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  refreshVista(e): void {
    this.cargarServicios();
  }

  cargarServicios(): void {

    this.bolCargandoServis = true;
    this.regservis.getServicios(this.usuarioSis.profileUser, this.chkFiltro ? 'TODOS' : '').then((resp: any) => {
      this.arrServicios = resp.data[0];
      this.bolCargandoServis = false;
    }).catch(err => {
      console.log(err);
      this.bolCargandoServis = false;
    });
  }

  //  ============ version  BEGIN =============================
  // abre el modal para agregar nueva version
  addVersion(item: Servicio): void {
    this.form.patchValue({
      idservicio: item.idservicio,
      usuario: this.usuarioSis.email,
      comentario: '',
      servicioItem: item.item
    });
    this.modalService.open(this.myModal);
  }

  // busca archivo para subir como nueva version
  uploadFile(event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      uploadFile: file
    });
    this.form.get('uploadFile').updateValueAndValidity();
  }

  // graba en la base de datos la nueva version
  submitFormGrabarVersion(): void {
    if (this.usuarioSis.profileUser === 'CALIDAD') {
      this.regservis.addVersionWithOutFile(this.form.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Version registrada',
            text: 'La version se registro sin archivo de subida.',
          });
          this.cargarServicios();
        } else {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resp.message,
          });
        }
      });
    } else {
      this.regservis.addVersionWithFile(this.form.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Version registrada',
            text: 'La version se registro con archivo.',
          });
          this.cargarServicios();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resp.message,
          });
          this.modalService.dismissAll();
        }

      });
    }

  }
  //  ============ version  END =============================



  // ========= cargar excel BEGIN ============================
  // abre el modal para buscar el archivo excel
  nuevoServicio(): void {
    this.modalService.open(this.myModalImport);
  }

  // Evento que Carga el excel a la grilla como vista
  onFileChange(evt: any): void {
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // console.log(e.target.result);

      const bstr: string = e.target.result;
      const data = this.excelSrv.importFromFile(bstr) as any[];
      const header: string[] = Object.getOwnPropertyNames(new ServicioExcel());
      console.log(data);
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

  // Graba en la base de datos los datos de la vista previa del excel con los datos del usuario
  registrarServicioExcel(): void {

    const currentDatetime = new Date();
    const formattedDate = currentDatetime.getFullYear()
      + '-' + (currentDatetime.getMonth() + 1).toString().padStart(2, '0')
      + '-' + currentDatetime.getDate();


    let cont = 1;
    this.importContacts.forEach(item => {
      const objParam = {
        item,
        cont,
        usuario: this.usuarioSis.email,
        cliente: this.formExcel.value.cliente,
        fechaCreacion: formattedDate
      };
      this.regservis.createRegServicio(objParam).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Servicios registrados',
            text: 'Los servicios se registraron correctamente.',
          });
        } else {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resp.message,
          });
        }
      }).catch(err => {
        console.log('el error del catch:', err);
      });
      cont++;
    });

    this.cargarServicios();
  }

  // ========= cargar excel END ============================

  // ========== flujo de versiones BEGIN =====================

  // lista las versiones por servicio y item de trabajo
  listaVersionxServicio(item: Servicio): void {
    this.idServicio = item.idservicio;
    this.regservis.getVersionesxServicio(item.idservicio, item.item, this.usuarioSis.profileUser).then((resp: any) => {
      this.arrVersiones = resp.data[0];
    });
    this.modalService.open(this.myModalVersiones);
  }

  // descarga el archivo dela version que se ve en el flujo del modal
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
  // ========== flujo de versiones END =====================

}
