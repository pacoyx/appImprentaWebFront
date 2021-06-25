import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/interfaces/usuario';
import { AreaService } from 'src/app/services/area.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarioForm: FormGroup;

  arrEstado: any[] = ['ACTIVO', 'INACTIVO'];
  arrArea: any[] = [];
  arrPerfil: any[] = ['ADMINISTRADOR', 'DISEÑADOR', 'CALIDAD'];
  arrUsuarios: Usuario[] = [];
  bolNuevo = true;
  loading = false;

  closeModal: string;
  @ViewChild('modalData') myModal: any;
  @ViewChild('focusInput', { static: false }) focusInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private usuServis: UsuarioService,
    private areaServis: AreaService,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nameUser: ['', Validators.required],
      profileUser: ['ADMINISTRADOR', Validators.required],
      area: ['ADMINISTRACION', Validators.required],
      statusUser: ['ACTIVO', Validators.required],
    });
    this.loading = true;
    this.usuServis.getUsuarios().then((resp: any) => {
      this.loading = false;
      this.arrUsuarios = resp.data[0];
    });

    this.areaServis.getAreas().then((resp: any) => {
      this.arrArea = resp.data[0];
    });
  }

  nuevoUsuario(): void {
    this.bolNuevo = true;
    this.usuarioForm.reset({
      profileUser: 'ADMINISTRADOR',
      statusUser: 'ACTIVO'
    });
    this.modalService.open(this.myModal);
    // this.focusInput.nativeElement.focus();
  }

  editarUsuario(usuarioEdit: Usuario): void {
    this.bolNuevo = false;
    this.usuarioForm.setValue({
      email: usuarioEdit.email,
      password: usuarioEdit.password,
      nameUser: usuarioEdit.nameUser,
      profileUser: usuarioEdit.profileUser,
      area: usuarioEdit.area,
      statusUser: usuarioEdit.statusUser
    });

    this.modalService.open(this.myModal);
  }

  eliminarUsuario(usuarioDelete: Usuario): void {
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

        this.usuarioForm.setValue({
          email: usuarioDelete.email,
          password: usuarioDelete.password,
          nameUser: usuarioDelete.nameUser,
          profileUser: usuarioDelete.profileUser,
          area: usuarioDelete.area,
          statusUser: 'INACTIVO'
        });

        this.usuServis.updateUser(this.usuarioForm.value).then((resp: any) => {
          if (resp.estado === 'ok') {
            this.modalService.dismissAll();
            Swal.fire({
              icon: 'success',
              title: 'El usuario a sido desactivado.',
              text: 'Los usuarios del sistema no pueden ser eliminados, solo desactivados.',
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

  regUsuario(): void {

    if (this.bolNuevo) {
      this.usuServis.createUser(this.usuarioForm.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Usuario registrado',
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
      this.usuServis.updateUser(this.usuarioForm.value).then((resp: any) => {
        if (resp.estado === 'ok') {
          this.modalService.dismissAll();
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
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

  triggerModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
