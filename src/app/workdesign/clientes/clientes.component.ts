import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/interfaces/cliente';
import { AppState } from 'src/app/store/app.reducers';
import { Store } from '@ngrx/store';
import { cargarCustomers, createCustomer, createCustomerCloseMsg } from 'src/app/store/actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, OnDestroy {

  clienteForm: FormGroup;
  arrClientes: any[] = [];
  arrEstado: any[] = ['ACTIVO', 'INACTIVO'];
  bolNuevo = true;
  loading = false;
  error: any;

  custom_loaded = false;
  custom_msj: string;
  custom_err: any;

  subsCustomerList: Subscription;
  subsCustomerCrud: Subscription;

  @ViewChild('modalData') myModal: any;

  constructor(
    private fb: FormBuilder,
    private clienteServis: ClientesService,
    private modalService: NgbModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.clienteForm = this.fb.group({
      idcliente: ['', Validators.required],
      descripcion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contacto: [''],
      movil: [''],
      estado: ['ACTIVO', Validators.required],
    });

    this.subsCustomerList = this.store.select('customers').subscribe(customers => {
      this.arrClientes = customers.customers;
      this.loading = customers.loading;
      this.error = customers.error;
    });

    this.subsCustomerCrud = this.store.select('customer').subscribe(custom => {
      this.custom_loaded = custom.loaded;
      this.custom_msj = custom.mensaje;
      this.custom_err = custom.error;
    });

    this.store.dispatch(cargarCustomers());



    // this.clienteServis.getClientes().then((resp: any) => {
    //   this.arrClientes = resp.data[0];
    // });
  }

  ngOnDestroy(): void {
    this.subsCustomerList.unsubscribe();

  }

  nuevoCliente(): void {
    this.bolNuevo = true;
    this.clienteForm.reset({
      estado: 'ACTIVO'
    });
    this.modalService.open(this.myModal);
  }

  regCliente(): void {

    if (this.clienteForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validaciones',
        text: 'Falta completar los datos.',
      });
    }

    if (this.bolNuevo) {
      console.log(this.clienteForm.value);

      this.store.dispatch(createCustomer({ customer: this.clienteForm.value }));
      this.modalService.dismissAll();
      this.store.dispatch(cargarCustomers());

      setTimeout(() => {
        this.store.dispatch(createCustomerCloseMsg());
      }, 3000);

      // this.clienteServis.createClientes(this.clienteForm.value).then((resp: any) => {
      //   if (resp.estado === 'ok') {
      //     this.modalService.dismissAll();
      //     Swal.fire({
      //       icon: 'success',
      //       title: 'Cliente registrado',
      //       text: resp.message,
      //     });
      //   } else {
      //     console.log('error', resp.message);
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Oops...',
      //       text: resp.message,
      //     });
      //     this.modalService.dismissAll();
      //   }
      // });
    } else {
      this.clienteServis.updateClientes(this.clienteForm.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: resp.message,
          });
        } else {
          console.log('error', resp.message);
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


  editarCliente(clienteEdit: Cliente): void {
    this.bolNuevo = false;
    this.clienteForm.setValue({
      idcliente: clienteEdit.idcliente,
      descripcion: clienteEdit.descripcion,
      correo: clienteEdit.correo,
      contacto: clienteEdit.contacto,
      movil: clienteEdit.movil,
      estado: clienteEdit.estado
    });

    this.modalService.open(this.myModal);
  }

  eliminarCliente(clienteEdit: Cliente): void {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'No podra revertir esta accion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        const dataBody: any = { idcliente: clienteEdit.idcliente };

        this.clienteServis.deleteClientes(dataBody).then((resp: any) => {
          if (resp.estado === 'ok') {
            this.modalService.dismissAll();
            Swal.fire({
              icon: 'success',
              title: 'El cliente a sido eliminado.',
              text: 'exito',
            });

          } else {
            console.log('error', resp.message);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: resp.message,
            });
            this.modalService.dismissAll();
          }
        });
      }
    });
  }

  isValidInput(fieldName): boolean {
    return this.clienteForm.controls[fieldName].invalid &&
      (this.clienteForm.controls[fieldName].dirty || this.clienteForm.controls[fieldName].touched);
  }

  // https://helperscript.com/how-to-read-the-excel-file-in-angular-with-xslx-package/
}
