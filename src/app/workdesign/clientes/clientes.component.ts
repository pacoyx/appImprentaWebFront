import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clienteForm: FormGroup;
  arrClientes: any[] = [];
  arrEstado: any[] = ['ACTIVO', 'INACTIVO'];
  bolNuevo = true;

  @ViewChild('modalData') myModal: any;

  constructor(private fb: FormBuilder, private clienteServis: ClientesService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.clienteForm = this.fb.group({
      idcliente: ['', Validators.required],
      descripcion: ['', Validators.required],
      correo: ['', Validators.email],
      contacto: [''],
      movil: [''],
      estado: ['ACTIVO', Validators.required],
    });

    this.clienteServis.getClientes().then((resp: any) => {
      this.arrClientes = resp.data[0];
    });
  }

  nuevoCliente(): void {
    this.bolNuevo = true;
    this.clienteForm.reset({
      estado: 'ACTIVO'
    });
    this.modalService.open(this.myModal);
  }

  regCliente() {
    if (this.bolNuevo) {
      this.clienteServis.createClientes(this.clienteForm.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Cliente registrado',
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


  // https://helperscript.com/how-to-read-the-excel-file-in-angular-with-xslx-package/
}
